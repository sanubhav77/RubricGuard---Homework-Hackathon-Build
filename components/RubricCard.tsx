
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RubricCriterion, GradedCriterion, ValidationStatus, AIValidationResult, GradedSubmission } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { validateJustification } from '../services/geminiService';
import { ValidationBadge } from './ValidationBadge';
import { AlertTriangleIcon, InfoIcon } from './icons';
import ValidationDetailModal from '../screens/ValidationDetailModal';

interface RubricCardProps {
    criterion: RubricCriterion;
    gradedCriterion: GradedCriterion;
    onUpdate: (updatedGradedCriterion: GradedCriterion) => void;
    submissionContent: string;
    highlightedText: string;
    clearHighlight: () => void;
    allGradedSubmissions: GradedSubmission[];
}

const RubricCard: React.FC<RubricCardProps> = ({ criterion, gradedCriterion, onUpdate, submissionContent, highlightedText, clearHighlight, allGradedSubmissions }) => {
    const [score, setScore] = useState<string>(gradedCriterion.score?.toString() ?? '');
    const [explanation, setExplanation] = useState<string>(gradedCriterion.explanation);
    const [attachedHighlight, setAttachedHighlight] = useState<string | undefined>(gradedCriterion.highlightedExcerpt);
    const [validationStatus, setValidationStatus] = useState<ValidationStatus>(ValidationStatus.UNVALIDATED);
    const [validationResult, setValidationResult] = useState<AIValidationResult | null>(gradedCriterion.validation);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    
    const debouncedScore = useDebounce(score, 700);
    const debouncedExplanation = useDebounce(explanation, 700);

    useEffect(() => {
        if (highlightedText) {
            setAttachedHighlight(highlightedText);
            clearHighlight();
        }
    }, [highlightedText, clearHighlight]);

    useEffect(() => {
        const scoreNum = score === '' ? null : Number(score);
        onUpdate({
            ...gradedCriterion,
            score: scoreNum,
            explanation,
            highlightedExcerpt: attachedHighlight,
            validation: validationResult,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score, explanation, attachedHighlight, validationResult]);

    const triggerValidation = useCallback(async () => {
        const scoreNum = Number(debouncedScore);
        if (debouncedExplanation.trim().length > 10 && !isNaN(scoreNum) && debouncedScore !== '') {
            setValidationStatus(ValidationStatus.VALIDATING);
            try {
                const result = await validateJustification(submissionContent, criterion, scoreNum, debouncedExplanation);
                const aiResult: AIValidationResult = { ...result, status: result.status as ValidationStatus };
                setValidationResult(aiResult);
                setValidationStatus(aiResult.status);
            } catch (error) {
                console.error(error);
                setValidationStatus(ValidationStatus.ERROR);
                setValidationResult(null);
            }
        }
    }, [debouncedScore, debouncedExplanation, submissionContent, criterion]);

    useEffect(() => {
        triggerValidation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedScore, debouncedExplanation]);

    const consistencyAlert = useMemo(() => {
        const scoreNum = Number(score);
        if (isNaN(scoreNum) || score === '' || allGradedSubmissions.length === 0) {
            return null;
        }

        const criterionScores = allGradedSubmissions
            .flatMap(s => s.criteria)
            .filter(c => c.criterionId === criterion.id && c.score !== null)
            .map(c => c.score as number);

        if (criterionScores.length < 1) {
            return null;
        }
        
        const mean = criterionScores.reduce((a, b) => a + b, 0) / criterionScores.length;
        const deviation = Math.abs(scoreNum - mean) / criterion.max_points;

        if (deviation > 0.03 * (criterionScores.length + 1) ) { // Deviation threshold increases slightly with more grades
            // Find an example to reference
            const closestScore = criterionScores.reduce((prev, curr) => 
                (Math.abs(curr - mean) < Math.abs(prev - mean) ? curr : prev)
            );
            const exampleSubmission = allGradedSubmissions.find(s => s.criteria.some(c => c.criterionId === criterion.id && c.score === closestScore));

            return {
                message: `This score deviates significantly from the session average of ${mean.toFixed(1)}.`,
                example: `Recall for ${exampleSubmission?.submissionId.replace('S','Student ')} you gave a score of ${closestScore}.`,
            };
        }
        return null;
    }, [score, criterion.id, criterion.max_points, allGradedSubmissions]);

    return (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-800">{criterion.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 pr-4">{criterion.description}</p>
                </div>
                <ValidationBadge status={validationStatus} onClick={() => validationResult && setIsDetailModalOpen(true)} />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                    <label htmlFor={`score-${criterion.id}`} className="block text-sm font-medium text-slate-700">Score</label>
                    <div className="relative mt-1">
                        <input
                            type="number"
                            id={`score-${criterion.id}`}
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            max={criterion.max_points}
                            min={0}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-slate-900"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 sm:text-sm">/ {criterion.max_points}</span>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-3">
                    <label htmlFor={`explanation-${criterion.id}`} className="block text-sm font-medium text-slate-700">Explanation</label>
                    <textarea
                        id={`explanation-${criterion.id}`}
                        rows={3}
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 bg-white text-slate-900"
                        placeholder="Provide justification for the score..."
                    />
                </div>
            </div>

            {attachedHighlight && (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-slate-700 rounded-r-md relative">
                    <p className="italic">"{attachedHighlight}"</p>
                    <button onClick={() => setAttachedHighlight(undefined)} className="absolute top-1 right-1 text-slate-400 hover:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}
            
            {consistencyAlert && (
                 <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 p-3 text-sm text-amber-800 rounded-r-md flex items-start space-x-3">
                    <AlertTriangleIcon className="h-5 w-5 flex-shrink-0 text-amber-500" />
                    <div>
                        <p className="font-semibold">Consistency Alert</p>
                        <p>{consistencyAlert.message}</p>
                        <p className="text-xs mt-1">{consistencyAlert.example}</p>
                    </div>
                </div>
            )}
            
             {validationResult && (
                 <div className="mt-3 bg-slate-100 border-l-4 border-slate-400 p-3 text-sm text-slate-700 rounded-r-md flex items-start space-x-3">
                    <InfoIcon className="h-5 w-5 flex-shrink-0 text-slate-500" />
                    <div>
                        <p className="font-semibold">AI Suggestion</p>
                        <p>{validationResult.suggestedRefinement}</p>
                    </div>
                </div>
             )}
            
            {isDetailModalOpen && validationResult && (
                <ValidationDetailModal 
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    validationResult={validationResult}
                    criterionName={criterion.name}
                />
            )}
        </div>
    );
};

export default RubricCard;

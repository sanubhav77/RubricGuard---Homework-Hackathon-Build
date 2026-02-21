
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Assignment, Submission, RubricCriterion, GradedSubmission, GradedCriterion, ValidationStatus } from '../types';
import { submissions as allSubmissions, rubricCriteria as allRubricCriteria } from '../data/seedData';
import SubmissionViewer from '../components/SubmissionViewer';
import RubricCard from '../components/RubricCard';
import AnalyticsSidebar from '../components/AnalyticsSidebar';

interface GradingWorkspaceProps {
    assignment: Assignment;
    onComplete: (gradedSubmissions: GradedSubmission[]) => void;
}

const GradingWorkspace: React.FC<GradingWorkspaceProps> = ({ assignment, onComplete }) => {
    const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
    const [gradedSubmissions, setGradedSubmissions] = useState<GradedSubmission[]>([]);
    const [highlightedText, setHighlightedText] = useState('');

    const submissions = useMemo(() => allSubmissions.filter(s => s.assignment_id === assignment.id).sort((a,b) => a.grading_order - b.grading_order), [assignment.id]);
    const rubricCriteria = useMemo(() => allRubricCriteria.filter(rc => rc.assignment_id === assignment.id), [assignment.id]);
    
    const currentSubmission = submissions[currentSubmissionIndex];

    const initializeGradingState = useCallback(() => {
        const initialGradedSubmissions = submissions.map(s => ({
            submissionId: s.id,
            criteria: rubricCriteria.map(rc => ({
                criterionId: rc.id,
                score: null,
                explanation: '',
                validation: null,
            })),
        }));
        setGradedSubmissions(initialGradedSubmissions);
    }, [submissions, rubricCriteria]);

    useEffect(() => {
        initializeGradingState();
    }, [initializeGradingState]);

    const currentGradedSubmission = useMemo(() => {
        return gradedSubmissions.find(gs => gs.submissionId === currentSubmission?.id);
    }, [gradedSubmissions, currentSubmission]);

    const handleCriterionUpdate = (submissionId: string, updatedCriterion: GradedCriterion) => {
        setGradedSubmissions(prev => prev.map(gs => 
            gs.submissionId === submissionId 
                ? { ...gs, criteria: gs.criteria.map(c => c.criterionId === updatedCriterion.criterionId ? updatedCriterion : c) }
                : gs
        ));
    };

    const handleNextSubmission = () => {
        if (currentSubmissionIndex < submissions.length - 1) {
            setCurrentSubmissionIndex(prev => prev + 1);
            setHighlightedText('');
        }
    };
    
    const handlePrevSubmission = () => {
        if (currentSubmissionIndex > 0) {
            setCurrentSubmissionIndex(prev => prev - 1);
            setHighlightedText('');
        }
    };

    const isCurrentSubmissionGraded = useMemo(() => {
        return currentGradedSubmission?.criteria.every(c => c.score !== null && c.explanation.trim() !== '');
    }, [currentGradedSubmission]);

    if (!currentSubmission || !currentGradedSubmission) {
        return <div className="text-center p-8">Loading grading workspace...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-screen-2xl mx-auto">
            {/* Left Column: Submission Viewer */}
            <div className="lg:col-span-4 xl:col-span-3">
                <SubmissionViewer 
                    submission={currentSubmission} 
                    onHighlight={setHighlightedText}
                />
            </div>

            {/* Center Column: Rubric Cards */}
            <div className="lg:col-span-5 xl:col-span-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Grading: <span className="text-blue-600">{currentSubmission.student_id}</span></h2>
                            <p className="text-sm text-slate-500">Submission {currentSubmissionIndex + 1} of {submissions.length}</p>
                        </div>
                        <div className="flex space-x-2">
                             <button onClick={handlePrevSubmission} disabled={currentSubmissionIndex === 0} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            {currentSubmissionIndex < submissions.length - 1 ? (
                                <button onClick={handleNextSubmission} disabled={!isCurrentSubmissionGraded} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                                    Next Submission
                                </button>
                            ) : (
                                <button onClick={() => onComplete(gradedSubmissions)} disabled={!isCurrentSubmissionGraded} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                                    Finalize & View Analytics
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        {rubricCriteria.map(criterion => {
                            const gradedCriterion = currentGradedSubmission.criteria.find(c => c.criterionId === criterion.id);
                            if (!gradedCriterion) return null;

                            return (
                                <RubricCard 
                                    key={criterion.id}
                                    criterion={criterion}
                                    gradedCriterion={gradedCriterion}
                                    onUpdate={(updatedCriterion) => handleCriterionUpdate(currentSubmission.id, updatedCriterion)}
                                    submissionContent={currentSubmission.content}
                                    highlightedText={highlightedText}
                                    clearHighlight={() => setHighlightedText('')}
                                    allGradedSubmissions={gradedSubmissions.slice(0, currentSubmissionIndex)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Right Column: Analytics */}
            <div className="lg:col-span-3 xl:col-span-3">
                <AnalyticsSidebar
                     allGradedSubmissions={gradedSubmissions}
                     rubricCriteria={rubricCriteria}
                />
            </div>
        </div>
    );
};

export default GradingWorkspace;

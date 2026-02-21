
import React from 'react';
import { AIValidationResult, ValidationStatus } from '../types';
import { VALIDATION_STATUS_CONFIG } from '../constants';

interface ValidationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    validationResult: AIValidationResult;
    criterionName: string;
}

const ValidationDetailModal: React.FC<ValidationDetailModalProps> = ({ isOpen, onClose, validationResult, criterionName }) => {
    if (!isOpen) return null;

    const statusConfig = VALIDATION_STATUS_CONFIG[validationResult.status as ValidationStatus];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className={`p-4 rounded-t-lg flex justify-between items-center ${statusConfig.bgColor}`}>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">AI Validation Details</h2>
                        <p className="text-sm font-medium text-slate-600">{criterionName}</p>
                    </div>
                    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${statusConfig.bgColor} ${statusConfig.color} border border-current`}>
                        {statusConfig.text}
                    </div>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <h3 className="font-semibold text-slate-700">Referenced Submission Excerpt</h3>
                        <blockquote className="mt-1 border-l-4 border-slate-300 pl-4 py-2 bg-slate-50 text-slate-600 text-sm italic">
                            "{validationResult.referencedExcerpt}"
                        </blockquote>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700">Reasoning</h3>
                        <p className="mt-1 text-sm text-slate-600">{validationResult.reasoning}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700">Suggested Refinement</h3>
                        <p className="mt-1 text-sm text-slate-600 bg-green-50 p-3 rounded-md border border-green-200">{validationResult.suggestedRefinement}</p>
                    </div>
                </div>

                <div className="px-6 py-3 bg-slate-50 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ValidationDetailModal;


import React from 'react';
import { Submission } from '../types';

interface SubmissionViewerProps {
    submission: Submission;
    onHighlight: (text: string) => void;
}

const SubmissionViewer: React.FC<SubmissionViewerProps> = ({ submission, onHighlight }) => {
    
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            onHighlight(selection.toString().trim());
        }
    };

    return (
        <div className="sticky top-20">
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Student Submission</h3>
                    <p className="text-sm text-slate-500">Student ID: {submission.student_id}</p>
                </div>
                <div className="p-4">
                    <div className="bg-slate-50 p-4 rounded-md max-h-[70vh] overflow-y-auto prose prose-sm max-w-none" onMouseUp={handleMouseUp}>
                        <p>{submission.content}</p>
                    </div>
                    <div className="mt-4 text-xs text-slate-500 text-center">
                        Highlight text to attach it to a criterion explanation.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionViewer;


import React from 'react';
import { assignments } from '../data/seedData';

interface AssignmentSelectionProps {
    onSelect: (assignmentId: string) => void;
}

const AssignmentSelection: React.FC<AssignmentSelectionProps> = ({ onSelect }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Select an Assignment</h2>
                <p className="mt-4 text-lg text-slate-600">Choose an assignment to begin your AI-assisted grading session.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <ul role="list" className="divide-y divide-slate-200">
                    {assignments.map((assignment) => (
                        <li key={assignment.id} className="group">
                            <button onClick={() => onSelect(assignment.id)} className="w-full text-left p-6 flex justify-between items-center group-hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="text-lg font-semibold text-blue-600">{assignment.title}</p>
                                    <p className="text-sm text-slate-500">{assignment.course} &middot; Rubric {assignment.rubric_version}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="mt-8 text-center text-sm text-slate-500 p-4 border-t border-slate-200">
                <p className="font-semibold">Prototype Academic Assistance Tool</p>
                <p>RubricGuard AI is designed to assist, not replace, professional academic judgment. The final grading authority remains with the professor.</p>
            </div>
        </div>
    );
};

export default AssignmentSelection;

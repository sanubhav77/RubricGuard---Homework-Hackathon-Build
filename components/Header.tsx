
import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="h-8 w-8 text-slate-800" />
                        <h1 className="text-xl font-bold text-slate-800">
                            RubricGuard <span className="text-blue-600">AI</span>
                        </h1>
                    </div>
                    {onBack && (
                         <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back to Assignments</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

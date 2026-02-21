
import React from 'react';
import { ValidationStatus } from '../types';
import { VALIDATION_STATUS_CONFIG } from '../constants';
import { LoadingSpinner } from './icons';

interface ValidationBadgeProps {
    status: ValidationStatus;
    onClick?: () => void;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ status, onClick }) => {
    const config = VALIDATION_STATUS_CONFIG[status];
    const isClickable = onClick && status !== ValidationStatus.VALIDATING && status !== ValidationStatus.UNVALIDATED;

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`flex items-center space-x-2 px-2.5 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.color} ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        >
            {status === ValidationStatus.VALIDATING ? (
                <LoadingSpinner className="h-3 w-3" />
            ) : (
                <span className={`h-2 w-2 rounded-full ${config.bgColor.replace('bg-', 'ring-2 ring-offset-1 ring-')} ring-opacity-50`} style={{ backgroundColor: config.color.replace('text-', 'bg-').split(' ')[0] }}></span>
            )}
            <span>{config.text}</span>
        </div>
    );
};

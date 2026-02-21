
import { ValidationStatus } from './types';

export const VALIDATION_STATUS_CONFIG: Record<ValidationStatus, { color: string; bgColor: string; text: string }> = {
    [ValidationStatus.UNVALIDATED]: { color: 'text-slate-500', bgColor: 'bg-slate-200', text: 'Unvalidated' },
    [ValidationStatus.VALIDATING]: { color: 'text-blue-600', bgColor: 'bg-blue-100', text: 'Validating...' },
    [ValidationStatus.SUPPORTED]: { color: 'text-green-600', bgColor: 'bg-green-100', text: 'Supported' },
    [ValidationStatus.PARTIALLY_SUPPORTED]: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', text: 'Partially Supported' },
    [ValidationStatus.NOT_SUPPORTED]: { color: 'text-red-600', bgColor: 'bg-red-100', text: 'Not Supported' },
    [ValidationStatus.ERROR]: { color: 'text-red-700', bgColor: 'bg-red-200', text: 'Validation Error' },
};


export enum Screen {
    ASSIGNMENT_SELECTION,
    GRADING_WORKSPACE,
    VALIDATION_DETAIL,
    SESSION_ANALYTICS
}

export enum ValidationStatus {
    UNVALIDATED = 'Unvalidated',
    VALIDATING = 'Validating',
    SUPPORTED = 'Supported',
    PARTIALLY_SUPPORTED = 'Partially Supported',
    NOT_SUPPORTED = 'Not Supported',
    ERROR = 'Error',
}

export interface Assignment {
    id: string;
    course: string;
    title: string;
    rubric_version: string;
}

export interface RubricCriterion {
    id: string;
    assignment_id: string;
    name: string;
    description: string;
    max_points: number;
    weight: number;
}

export interface Submission {
    id: string;
    assignment_id: string;
    student_id: string;
    content: string;
    grading_order: number;
}

export interface AIValidationResult {
    status: ValidationStatus;
    referencedExcerpt: string;
    reasoning: string;
    suggestedRefinement: string;
}

export interface GradedCriterion {
    criterionId: string;
    score: number | null;
    explanation: string;
    highlightedExcerpt?: string;
    validation: AIValidationResult | null;
}

export interface GradedSubmission {
    submissionId: string;
    criteria: GradedCriterion[];
}

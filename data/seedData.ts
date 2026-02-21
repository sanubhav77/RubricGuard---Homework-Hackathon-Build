
import { Assignment, RubricCriterion, Submission } from '../types';

export const assignments: Assignment[] = [
    { "id": "A1", "course": "BUS302", "title": "Case Analysis 1: Strategic Pivot", "rubric_version": "v1.0" }
];

export const rubricCriteria: RubricCriterion[] = [
    { "id": "C1", "assignment_id": "A1", "name": "Argument Clarity", "description": "Thesis is clear, argments are well-structured, and reasoning is logical. The core argument should be identifiable within the first paragraph and consistently referenced.", "max_points": 25, "weight": 0.25 },
    { "id": "C2", "assignment_id": "A1", "name": "Evidence Use", "description": "Effectively integrates and analyzes credible sources to support claims. Evidence should not just be stated but explained in the context of the argument.", "max_points": 25, "weight": 0.25 },
    { "id": "C3", "assignment_id": "A1", "name": "Critical Analysis", "description": "Goes beyond surface-level description to offer insightful analysis of the case. Considers counterarguments and nuances of the situation.", "max_points": 30, "weight": 0.30 },
    { "id": "C4", "assignment_id": "A1", "name": "Professionalism & Formatting", "description": "Writing is clear, concise, and free of errors. Formatting follows specified guidelines (e.g., APA, MLA).", "max_points": 20, "weight": 0.20 }
];

export const submissions: Submission[] = [
    { "id": "S1", "assignment_id": "A1", "student_id": "STU001", "content": "The central argument of this analysis is that the firm should pivot to a subscription-based pricing model. This is because recurring revenue streams offer greater financial stability and predictability. For example, similar companies in the sector saw a 40% increase in valuation post-transition. The current model is too dependent on one-time large purchases, which creates significant cash flow volatility. While the analysis identifies market trends, it fails to connect them directly to the firm's core competencies. A subscription model aligns better with our agile production capabilities. The transition would require significant marketing investment, but the long-term payoff justifies the initial risk.", "grading_order": 1 },
    { "id": "S2", "assignment_id": "A1", "student_id": "STU002", "content": "This paper argues against the proposed pivot. The primary reason is the established brand identity, which is built on high-value, single-purchase products. A shift to subscriptions could dilute this brand equity. Furthermore, the existing customer base is not accustomed to this model and may churn. While some competitors have succeeded, our market research indicates our customers prefer ownership over access. The evidence presented in favor of the pivot is largely based on different market segments. Instead of a full pivot, a hybrid model should be considered, offering a premium subscription tier for services while retaining the core product sales. This balances innovation with risk management. The analysis is strong but the recommendation is weak.", "grading_order": 2 },
    { "id": "S3", "assignment_id": "A1", "student_id": "STU003", "content": "Market trends clearly indicate a shift towards service-based economies. The firm's reluctance to adapt is a significant strategic error. Subscription models are the future. The firm must pivot immediately to remain competitive. The logic is simple: follow the market or become obsolete. Many examples show this to be true. The implementation details are secondary to the strategic imperative. This is the only way forward.", "grading_order": 3 }
];

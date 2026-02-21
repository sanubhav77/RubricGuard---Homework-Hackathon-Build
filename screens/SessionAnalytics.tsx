
import React, { useMemo } from 'react';
import { Assignment, GradedSubmission, RubricCriterion, ValidationStatus } from '../types';
import { rubricCriteria as allRubricCriteria } from '../data/seedData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangleIcon, CheckCircleIcon } from '../components/icons';

interface SessionAnalyticsProps {
    assignment: Assignment;
    gradedSubmissions: GradedSubmission[];
    onBack: () => void;
}

const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({ assignment, gradedSubmissions, onBack }) => {
    const rubricCriteria = useMemo(() => allRubricCriteria.filter(rc => rc.assignment_id === assignment.id), [assignment.id]);
    
    const gradedCriteria = useMemo(() => gradedSubmissions.flatMap(gs => gs.criteria).filter(c => c.score !== null), [gradedSubmissions]);

    const analytics = useMemo(() => {
        const totalValidations = gradedCriteria.filter(c => c.validation).length;
        const supportedCount = gradedCriteria.filter(c => c.validation?.status === ValidationStatus.SUPPORTED).length;
        const partialCount = gradedCriteria.filter(c => c.validation?.status === ValidationStatus.PARTIALLY_SUPPORTED).length;
        const notSupportedCount = gradedCriteria.filter(c => c.validation?.status === ValidationStatus.NOT_SUPPORTED).length;

        const scoreTimeline = gradedSubmissions.map((gs, index) => {
            const scores = gs.criteria.map(c => c.score || 0);
            const totalScore = scores.reduce((a, b) => a + b, 0);
            return { name: `Sub ${index + 1}`, score: totalScore };
        });

        const criterionStability = rubricCriteria.map(rc => {
            const scores = gradedCriteria.filter(c => c.criterionId === rc.id).map(c => c.score as number);
            const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
            const stdDev = Math.sqrt(scores.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / scores.length);
            return { name: rc.name, stability: stdDev, mean: mean };
        });

        const highRiskDecisions = gradedCriteria.filter(c => c.validation?.status === ValidationStatus.NOT_SUPPORTED || (c.validation?.status === ValidationStatus.PARTIALLY_SUPPORTED && Math.random() > 0.5)); // add some randomness for demo

        return {
            totalSubmissions: gradedSubmissions.length,
            avgScore: scoreTimeline.reduce((acc, s) => acc + s.score, 0) / scoreTimeline.length,
            validityRate: totalValidations > 0 ? (supportedCount / totalValidations) * 100 : 0,
            validationDistribution: [
                { name: 'Supported', value: supportedCount, fill: '#16a34a' },
                { name: 'Partial', value: partialCount, fill: '#f59e0b' },
                { name: 'Not Supported', value: notSupportedCount, fill: '#dc2626' },
            ],
            scoreTimeline,
            criterionStability,
            highRiskDecisions
        };
    }, [gradedSubmissions, gradedCriteria, rubricCriteria]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Grading Session Analytics</h2>
                <p className="mt-4 text-lg text-slate-600">Summary for {assignment.title}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-medium text-slate-500">Submissions Graded</h3>
                    <p className="text-4xl font-bold mt-2">{analytics.totalSubmissions}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-medium text-slate-500">Average Score</h3>
                    <p className="text-4xl font-bold mt-2">{analytics.avgScore.toFixed(1)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-medium text-slate-500">AI Support Rate</h3>
                    <p className="text-4xl font-bold mt-2 text-green-600">{analytics.validityRate.toFixed(0)}%</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4">Score Timeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.scoreTimeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4">Criterion Stability (Lower is better)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.criterionStability} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="stability" name="Standard Deviation" barSize={20}>
                                {analytics.criterionStability.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.stability > 1.5 ? '#f59e0b' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* High Risk Decisions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold mb-4 text-lg">High-Risk Grading Decisions to Review</h3>
                {analytics.highRiskDecisions.length > 0 ? (
                    <ul className="divide-y divide-slate-200">
                        {analytics.highRiskDecisions.map((decision, index) => {
                            const submissionId = gradedSubmissions.find(gs => gs.criteria.includes(decision))?.submissionId;
                            const criterion = rubricCriteria.find(rc => rc.id === decision.criterionId);
                            return (
                                <li key={index} className="py-4 flex items-start space-x-4">
                                    <AlertTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-medium">{criterion?.name} on Submission {submissionId}</p>
                                        <p className="text-sm text-slate-600">Score: <span className="font-semibold">{decision.score}</span> | AI Status: <span className="font-semibold text-red-600">{decision.validation?.status}</span></p>
                                        <p className="text-xs text-slate-500 mt-1 italic">"{decision.explanation}"</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-8 flex flex-col items-center justify-center text-slate-500">
                         <CheckCircleIcon className="h-12 w-12 text-green-500 mb-2"/>
                        <p className="font-semibold">No high-risk decisions flagged.</p>
                        <p>Grading was consistent and well-supported.</p>
                    </div>
                )}
            </div>
            
            <div className="text-center py-4">
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    Finalize Grades & Return
                </button>
            </div>
        </div>
    );
};

export default SessionAnalytics;

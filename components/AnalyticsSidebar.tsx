
import React, { useMemo } from 'react';
import { GradedSubmission, RubricCriterion, ValidationStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsSidebarProps {
    allGradedSubmissions: GradedSubmission[];
    rubricCriteria: RubricCriterion[];
}

const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({ allGradedSubmissions, rubricCriteria }) => {
    
    const gradedCriteria = useMemo(() => {
        return allGradedSubmissions.flatMap(gs => gs.criteria).filter(c => c.score !== null);
    }, [allGradedSubmissions]);

    const analytics = useMemo(() => {
        const totalValidations = gradedCriteria.filter(c => c.validation).length;
        if (totalValidations === 0) {
            return {
                validityRate: 0,
                consistencyIndicator: 'bg-slate-400',
                criterionVarianceData: [],
            };
        }

        const supportedCount = gradedCriteria.filter(c => c.validation?.status === ValidationStatus.SUPPORTED).length;
        const validityRate = (supportedCount / totalValidations) * 100;
        
        const totalDeviation = gradedCriteria.reduce((acc, c) => {
            const scoresForCriterion = gradedCriteria
                .filter(other => other.criterionId === c.criterionId)
                .map(i => i.score as number);
            if(scoresForCriterion.length < 2) return acc;
            
            const mean = scoresForCriterion.reduce((a, b) => a + b, 0) / scoresForCriterion.length;
            const criterion = rubricCriteria.find(rc => rc.id === c.criterionId);
            return acc + (Math.abs((c.score as number) - mean) / (criterion?.max_points || 25));
        }, 0);
        
        const avgDeviation = (totalDeviation / gradedCriteria.length) * 100;
        
        let consistencyIndicator = 'bg-green-500';
        if (avgDeviation > 5) consistencyIndicator = 'bg-yellow-500';
        if (avgDeviation > 10) consistencyIndicator = 'bg-red-500';

        const criterionVarianceData = rubricCriteria.map(rc => {
            const scores = gradedCriteria.filter(c => c.criterionId === rc.id).map(c => c.score as number);
            if (scores.length < 2) return { name: rc.name.split(' ')[0], variance: 0 };
            const mean = scores.reduce((a, b) => a + b) / scores.length;
            const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
            return { name: rc.name.split(' ')[0], variance: variance };
        });

        return { validityRate, consistencyIndicator, criterionVarianceData };
    }, [gradedCriteria, rubricCriteria]);

    return (
        <div className="sticky top-20 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Live Analytics</h3>
            
            {gradedCriteria.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                    <p>Start grading to see live analytics.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-slate-600">Explanation Validity Rate</h4>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${analytics.validityRate}%` }}></div>
                            </div>
                            <span className="text-sm font-bold text-slate-700">{analytics.validityRate.toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">AI-supported justifications.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-slate-600">Overall Consistency</h4>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className={`w-6 h-6 rounded-full ${analytics.consistencyIndicator}`}></div>
                            <span className="text-sm font-medium text-slate-700">
                                {analytics.consistencyIndicator.includes('green') && 'Stable'}
                                {analytics.consistencyIndicator.includes('yellow') && 'Moderate Drift'}
                                {analytics.consistencyIndicator.includes('red') && 'High Drift'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Based on score variance from session average.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-slate-600 mb-2">Criterion Score Variance</h4>
                        <div style={{ width: '100%', height: 150 }}>
                            <ResponsiveContainer>
                                <BarChart data={analytics.criterionVarianceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ fontSize: '12px', padding: '5px' }} />
                                    <Bar dataKey="variance" fill="#4f46e5" barSize={20}>
                                         {analytics.criterionVarianceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.variance > 5 ? '#f59e0b' : '#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsSidebar;

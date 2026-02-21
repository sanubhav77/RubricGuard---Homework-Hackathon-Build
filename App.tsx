
import React, { useState, useCallback } from 'react';
import { Screen, Assignment, GradedSubmission } from './types';
import AssignmentSelection from './screens/AssignmentSelection';
import GradingWorkspace from './screens/GradingWorkspace';
import SessionAnalytics from './screens/SessionAnalytics';
import { assignments } from './data/seedData';
import { Header } from './components/Header';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ASSIGNMENT_SELECTION);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [gradedSubmissions, setGradedSubmissions] = useState<GradedSubmission[]>([]);

    const handleAssignmentSelect = useCallback((assignmentId: string) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (assignment) {
            setSelectedAssignment(assignment);
            setCurrentScreen(Screen.GRADING_WORKSPACE);
            setGradedSubmissions([]);
        }
    }, []);

    const handleGradingComplete = useCallback((finalGradedSubmissions: GradedSubmission[]) => {
        setGradedSubmissions(finalGradedSubmissions);
        setCurrentScreen(Screen.SESSION_ANALYTICS);
    }, []);

    const handleBackToAssignments = useCallback(() => {
        setSelectedAssignment(null);
        setGradedSubmissions([]);
        setCurrentScreen(Screen.ASSIGNMENT_SELECTION);
    }, []);

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.ASSIGNMENT_SELECTION:
                return <AssignmentSelection onSelect={handleAssignmentSelect} />;
            case Screen.GRADING_WORKSPACE:
                if (selectedAssignment) {
                    return <GradingWorkspace assignment={selectedAssignment} onComplete={handleGradingComplete} />;
                }
                return <div>Error: No assignment selected.</div>;
            case Screen.SESSION_ANALYTICS:
                if (selectedAssignment) {
                    return <SessionAnalytics assignment={selectedAssignment} gradedSubmissions={gradedSubmissions} onBack={handleBackToAssignments} />;
                }
                return <div>Error: No session data available.</div>;
            default:
                return <AssignmentSelection onSelect={handleAssignmentSelect} />;
        }
    };
    
    const showBackButton = currentScreen === Screen.SESSION_ANALYTICS;

    return (
        <div className="min-h-screen bg-slate-100">
            <Header onBack={showBackButton ? handleBackToAssignments : undefined} />
            <main className="p-4 sm:p-6 lg:p-8">
                {renderScreen()}
            </main>
        </div>
    );
};

export default App;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@/hooks/useApiClient';
import { useExamStore } from '@/store/useExamStore';
import { ExamHeader } from './ExamHeader';
import { QuestionCard } from './QuestionCard';
import { ExamNavigation } from './ExamNavigation';
import { ExamSidebar } from './ExamSidebar';
import { SubmitExamDialog } from './SubmitExamDialog';
import type { ExamMode } from '@/types';

interface ExamInterfaceProps {
    examId: string;
    mode: ExamMode;
}

export function ExamInterface({ examId, mode }: ExamInterfaceProps) {
    const router = useRouter();
    const { startExam, loading, error } = useApiClient();
    const { session, initializeSession, clearSession } = useExamStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Only initialize if we don't have a session or if exam/mode changed
        const needsInitialization = 
            !session || 
            session.examId !== examId || 
            session.mode !== mode;

        if (needsInitialization && !isInitialized) {
            const initExam = async () => {
                const response = await startExam(examId, mode);
                if (response?.session) {
                    initializeSession(response.session);
                    setIsInitialized(true);
                } else {
                    router.push('/dashboard');
                }
            };

            initExam();
        } else if (session && !isInitialized) {
            setIsInitialized(true);
        }

        // Cleanup on unmount - clear session when leaving exam
        return () => {
            // Don't clear session during navigation within exam
        };
    }, [examId, mode, session, startExam, initializeSession, router, isInitialized]);

    // Show loading state
    if (loading || !session || !isInitialized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-destructive mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <ExamHeader />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Question Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container max-w-4xl mx-auto p-4 md:p-6">
                        <QuestionCard />
                        <ExamNavigation />
                    </div>
                </main>

                {/* Sidebar - Hidden on mobile, shown on desktop */}
                <ExamSidebar />
            </div>

            {/* Submit Dialog */}
            <SubmitExamDialog />
        </div>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { useApiClient } from '@/hooks/useApiClient';
import { DashboardHeader } from './DashboardHeader';
import { ExamCard } from './ExamCard';
import { QuickStats } from './QuickStats';
import type { Exam } from '@/types';

export function DashboardInterface() {
    const { getExams, loading, error } = useApiClient();
    const [exams, setExams] = useState<Exam[]>([]);

    useEffect(() => {
        const fetchExams = async () => {
            const response = await getExams();
            if (response?.exams) {
                setExams(response.exams);
            }
        };

        fetchExams();
    }, [getExams]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-destructive mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <QuickStats />
                
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6">Available Practice Exams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
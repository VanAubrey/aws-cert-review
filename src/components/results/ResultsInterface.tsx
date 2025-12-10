'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@/hooks/useApiClient';
import { ResultsHeader } from './ResultsHeader';
import { ResultsOverview } from './ResultsOverview';
import { ResultsBreakdown } from './ResultsBreakdown';
import { QuestionReview } from './QuestionReview';
import type { ExamResults } from '@/types';

interface ResultsInterfaceProps {
    attemptId: string;
}

export function ResultsInterface({ attemptId }: ResultsInterfaceProps) {
    const router = useRouter();
    const { getResults, loading, error } = useApiClient();
    const [results, setResults] = useState<ExamResults | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            const response = await getResults(attemptId);
            if (response?.results) {
                setResults(response.results);
            } else {
                router.push('/dashboard');
            }
        };

        fetchResults();
    }, [attemptId, getResults, router]);

    if (loading || !results) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading results...</p>
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-background">
            <ResultsHeader results={results} />
            
            <div className="container max-w-6xl mx-auto px-4 py-8">
                <ResultsOverview results={results} />
                <ResultsBreakdown results={results} />
                <QuestionReview results={results} />
            </div>
        </div>
    );
}
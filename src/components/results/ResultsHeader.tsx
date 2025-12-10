'use client';

import { useRouter } from 'next/navigation';
import { Award, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculatePercentage } from '@/lib/exam-utils';
import type { ExamResults } from '@/types';

interface ResultsHeaderProps {
    results: ExamResults;
}

export function ResultsHeader({ results }: ResultsHeaderProps) {
    const router = useRouter();
    const percentage = calculatePercentage(results.score);

    return (
        <header className="border-b bg-card">
            <div className="container max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Exam Info */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Exam Results
                        </h1>
                        <p className="text-muted-foreground">
                            {results.examTitle} ({results.examCode})
                        </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="gap-2"
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => router.push(`/exam/${results.examId.toLowerCase()}?mode=timed`)}
                            className="gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span className="hidden sm:inline">Retake Exam</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
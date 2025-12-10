'use client';

import { Progress } from '@/components/ui/progress';
import { useExamProgress } from '@/store/exam-helpers';

export function ExamProgress() {
    const progress = useExamProgress() as { answered: number; total: number };

    const percentage = Math.round((progress.answered / progress.total) * 100) || 0;

    if (progress.total === 0) return null;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Progress: {progress.answered}/{progress.total}
                </span>
                <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    );
}
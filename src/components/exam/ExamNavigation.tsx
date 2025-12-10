'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExamStore, useCanNavigate } from '@/store/useExamStore';

export function ExamNavigation() {
    const { previousQuestion, nextQuestion } = useExamStore();
    const { canPrev, canNext } = useCanNavigate();

    return (
        <div className="flex items-center justify-between mt-6">
            <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={!canPrev}
                className="gap-2"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
            </Button>

            <Button
                variant="default"
                onClick={nextQuestion}
                disabled={!canNext}
                className="gap-2"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
'use client';

import { Timer } from './Timer';
import { ExamProgress } from './ExamProgress';
import { MobileMenuButton } from './MobileMenuButton';
import { useExamMetadata } from '@/store/exam-helpers';

export function ExamHeader() {
    const metadata = useExamMetadata();

    if (!metadata) return null;

    const isTimed = metadata.mode === 'timed';

    return (
        <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Left: Exam Info */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
                        {metadata.examTitle}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {metadata.examCode} • {isTimed ? 'Timed' : 'Practice'} Mode
                    </p>
                </div>

                {/* Center: Progress (Desktop) */}
                <div className="hidden md:block">
                    <ExamProgress />
                </div>

                {/* Right: Timer & Menu */}
                <div className="flex items-center gap-3">
                    {isTimed && <Timer />}
                    <MobileMenuButton />
                </div>
            </div>

            {/* Mobile Progress */}
            <div className="md:hidden border-t px-4 py-2">
                <ExamProgress />
            </div>
        </header>
    );
}
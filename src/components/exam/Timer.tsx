'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { useExamStore } from '@/store/useExamStore';
import { useExamMetadata } from '@/store/exam-helpers';
import { formatTimeRemaining } from '@/lib/exam-utils';

export function Timer() {
    const metadata = useExamMetadata();
    const session = useExamStore((state) => state.session);
    const updateTimeRemaining = useExamStore((state) => state.updateTimeRemaining);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Only run timer in timed mode
        if (!session || !metadata || metadata.mode !== 'timed') {
            return;
        }

        // Initialize time remaining
        if (session.timeRemaining !== null) {
            setTimeLeft(session.timeRemaining);
        }

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Update timer every second
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 0) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    // TODO: Auto-submit exam when time runs out
                    return 0;
                }
                
                const newTime = prev - 1;
                
                // Update store outside of render cycle using queueMicrotask
                queueMicrotask(() => {
                    updateTimeRemaining(newTime);
                });
                
                return newTime;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [session?.timeRemaining, metadata?.mode, updateTimeRemaining]);

    // Don't render timer in untimed mode
    if (!metadata || metadata.mode !== 'timed' || timeLeft === null) {
        return null;
    }

    const isLowTime = timeLeft < 300; // Less than 5 minutes

    return (
        <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-mono ${
                isLowTime
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-muted text-foreground'
            }`}
        >
            <Clock className="h-4 w-4" />
            <span className="text-sm md:text-base font-semibold">
                {formatTimeRemaining(timeLeft)}
            </span>
        </div>
    );
}
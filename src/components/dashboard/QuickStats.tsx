'use client';

import { Award, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function QuickStats() {
    // TODO: Fetch real stats from API
    const stats = [
        {
            title: 'Total Attempts',
            value: '0',
            icon: Award,
            description: 'Practice exams taken',
        },
        {
            title: 'Exams Passed',
            value: '0',
            icon: CheckCircle,
            description: 'Successful completions',
        },
        {
            title: 'Study Time',
            value: '0h',
            icon: Clock,
            description: 'Time spent practicing',
        },
        {
            title: 'Best Score',
            value: '-',
            icon: TrendingUp,
            description: 'Highest achievement',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
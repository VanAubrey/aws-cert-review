import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface OptionData {
    text: string;
    isCorrect: boolean;
}

interface QuestionData {
    text: string;
    options: OptionData[];
}

interface ExamData {
    examCode: string;
    examTitle: string;
    questions: QuestionData[];
}

export async function seedSAAC03(prisma: PrismaClient) {
    console.log('📚 Seeding SAA-C03 exam...');

    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'scripts', 'data', 'json', 'saa-c03.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const examData: ExamData = JSON.parse(jsonData);

    // Check if exam already exists
    const existingExam = await prisma.exam.findUnique({
        where: { code: examData.examCode },
    });

    if (existingExam) {
        console.log(`  ⚠️  Exam ${examData.examCode} already exists. Skipping...`);
        return;
    }

    // Create exam with questions and options
    const exam = await prisma.exam.create({
        data: {
            code: examData.examCode,
            title: examData.examTitle,
            duration: 130, // SAA-C03 is 130 minutes
            passingScore: 720, // SAA-C03 passing score
            questions: {
                create: examData.questions
                    .filter((question) => question.options.length > 0) // Only include questions with options
                    .map((question) => ({
                        text: question.text,
                        options: {
                            create: question.options.map((option) => ({
                                text: option.text,
                                isCorrect: option.isCorrect,
                            })),
                        },
                    })),
            },
        },
        include: {
            questions: {
                include: {
                    options: true,
                },
            },
        },
    });

    console.log(`  ✓ Created exam: ${exam.title}`);
    console.log(`  ✓ Created ${exam.questions.length} questions`);
    console.log(`  ✓ Created ${exam.questions.reduce((sum: number, q: { options: any[] }) => sum + q.options.length, 0)} options`);
}
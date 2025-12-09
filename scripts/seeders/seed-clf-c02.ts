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

export async function seedCLFC02(prisma: PrismaClient) {
    console.log('📚 Seeding CLF-C02 exam...');

    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'scripts', 'data', 'json', 'clf-c02.json');
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
            duration: 90, // CLF-C02 is 90 minutes
            passingScore: 700, // Standard AWS passing score
            questions: {
                create: examData.questions.map((question) => ({
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
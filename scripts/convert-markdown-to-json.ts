import fs from 'fs';
import path from 'path';

interface Option {
    text: string;
    isCorrect: boolean;
}

interface Question {
    text: string;
    options: Option[];
}

interface ExamData {
    examCode: string;
    examTitle: string;
    questions: Question[];
}

function parseMarkdownToJson(markdownContent: string, examCode: string): ExamData {
    const lines = markdownContent.split('\n');
    const questions: Question[] = [];
    let currentQuestion: Question | null = null;
    let currentOptions: Option[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) continue;

        // Skip title lines (starting with #)
        if (line.startsWith('#') && !line.startsWith('###')) continue;

        // Check if line starts with ### (question marker)
        if (line.startsWith('###')) {
            // Save previous question if exists
            if (currentQuestion && currentOptions.length > 0) {
                currentQuestion.options = currentOptions;
                questions.push(currentQuestion);
            }

            // Start new question (remove the ### prefix)
            const questionText = line.replace(/^###\s+/, '').trim();
            currentQuestion = {
                text: questionText,
                options: []
            };
            currentOptions = [];
        }
        // Check if line is an option (starts with - [ ] or - [x])
        else if (line.match(/^-\s*\[[\sx]\]/i)) {
            const isCorrect = line.toLowerCase().includes('[x]');
            // Remove the checkbox part and get the option text
            const optionText = line.replace(/^-\s*\[[\sx]\]\s*/i, '').trim();

            if (optionText) {
                currentOptions.push({
                    text: optionText,
                    isCorrect
                });
            }
        }
    }

    // Don't forget to add the last question
    if (currentQuestion && currentOptions.length > 0) {
        currentQuestion.options = currentOptions;
        questions.push(currentQuestion);
    }

    // Determine exam title based on code
    const examTitles: Record<string, string> = {
        'CLF-C02': 'AWS Certified Cloud Practitioner',
        'SAA-C03': 'AWS Certified Solutions Architect - Associate'
    };

    return {
        examCode,
        examTitle: examTitles[examCode] || examCode,
        questions
    };
}

function convertMarkdownFile(inputPath: string, outputPath: string, examCode: string) {
    try {
        console.log(`Converting ${path.basename(inputPath)}...`);

        // Read markdown file
        const markdownContent = fs.readFileSync(inputPath, 'utf-8');

        // Parse to JSON
        const examData = parseMarkdownToJson(markdownContent, examCode);

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write JSON file
        fs.writeFileSync(outputPath, JSON.stringify(examData, null, 2), 'utf-8');

        console.log(`✓ Converted ${examData.questions.length} questions to ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`Error converting ${inputPath}:`, error);
        throw error;
    }
}

// Main execution
const scriptsDir = path.join(process.cwd(), 'scripts');
const markdownDir = path.join(scriptsDir, 'data', 'markdown');
const jsonDir = path.join(scriptsDir, 'data', 'json');

// Convert CLF-C02
convertMarkdownFile(
    path.join(markdownDir, 'clf-c02.md'),
    path.join(jsonDir, 'clf-c02.json'),
    'CLF-C02'
);

// Convert SAA-C03
convertMarkdownFile(
    path.join(markdownDir, 'saa-c03.md'),
    path.join(jsonDir, 'saa-c03.json'),
    'SAA-C03'
);

console.log('\n✓ All files converted successfully!');
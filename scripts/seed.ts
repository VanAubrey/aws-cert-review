import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

import { seedCLFC02 } from './seeders/seed-clf-c02';
import { seedSAAC03 } from './seeders/seed-saa-c03';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...\n');

    try {
        // Seed CLF-C02 exam
        await seedCLFC02(prisma);

        // Seed SAA-C03 exam
        await seedSAAC03(prisma);

        console.log('\n✅ Database seeding completed successfully!');
    } catch (error) {
        console.error('\n❌ Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

// Import the seed data from the scripts directory
const seedDataPath = path.join(__dirname, '../src/scripts/seed.ts');
// Check if seed data exists
if (!fs.existsSync(seedDataPath)) {
    console.error('Seed data file not found at:', seedDataPath);
    process.exit(1);
}

// Import seed data directly
import { main as seedDatabase } from '../src/scripts/seed';

// Run the seed
seedDatabase()
    .then(() => console.log('Seeding completed'))
    .catch(e => {
        console.error('Error seeding database:', e);
        process.exit(1);
    }); 
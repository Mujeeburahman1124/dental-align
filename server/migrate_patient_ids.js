
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const migratePatientIds = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dental-align';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB...');

        const patients = await User.find({ role: 'patient' }).sort({ createdAt: 1 });

        // Find the highest existing patientId to start from
        const patientsWithId = patients.filter(p => p.patientId);
        let lastId = 1000;

        patientsWithId.forEach(p => {
            const num = parseInt(p.patientId.split('-')[1]);
            if (num > lastId) lastId = num;
        });

        console.log(`Starting allocation from P-${lastId + 1}...`);

        let updatedCount = 0;
        for (const p of patients) {
            if (!p.patientId) {
                lastId++;
                p.patientId = `P-${lastId}`;
                await p.save();
                console.log(`Assigned ${p.patientId} to ${p.fullName}`);
                updatedCount++;
            }
        }

        console.log(`Migration Complete. Updated ${updatedCount} patients.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration Error:', error);
        process.exit(1);
    }
};

migratePatientIds();

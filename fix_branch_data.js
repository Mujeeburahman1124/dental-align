import mongoose from 'mongoose';
import Branch from './server/models/Branch.js';
import TreatmentRecord from './server/models/TreatmentRecord.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

async function fixBranches() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to fix branches...');

        // 1. Ensure Kandy & Kurunegala exist
        const branchNames = ['Kandy City Clinic', 'Kurunegala Dental Hub', 'Colombo Elite Clinic'];
        for (const name of branchNames) {
            const exists = await Branch.findOne({ name });
            if (!exists) {
                await Branch.create({ name, location: name.split(' ')[0], contactNumber: '0112345678' });
                console.log(`Created branch: ${name}`);
            }
        }

        // 2. Assign treatments randomly to branches to show analysis diversity
        const allBranches = await Branch.find();
        const treatments = await TreatmentRecord.find();
        
        console.log(`Updating ${treatments.length} treatments across branches...`);
        for (const t of treatments) {
            const randomBranch = allBranches[Math.floor(Math.random() * allBranches.length)];
            t.branch = randomBranch._id;
            await t.save();
        }

        console.log('SUCCESS: All branches seeded and treatments assigned.');
        process.exit(0);

    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

fixBranches();

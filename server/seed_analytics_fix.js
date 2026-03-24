import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TreatmentRecord from './models/TreatmentRecord.js';
import User from './models/User.js';
import Branch from './models/Branch.js';

dotenv.config({ path: '.env' });

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await TreatmentRecord.deleteMany();
        console.log('Cleared treatments.');

        const patients = await User.find({ role: 'patient' });
        const dentists = await User.find({ role: 'dentist' });
        const branches = await Branch.find();

        if (dentists.length === 0 || branches.length === 0) {
            console.log('Ensure dentists and branches are seeded.');
            process.exit(1);
        }

        const titles = ["Scaling and Root Planing", "Orthodontic Adjustment", "Composite Restoration", "Root Canal Therapy"];
        const procs = [["Scaling"], ["Wire Adjustment"], ["Caries Removal"], ["Access cavity prep"]];

        let count = 0;
        const now = new Date();

        for (const patient of patients) {
            const numRecords = 2; // Fixed 2 per patient
            for(let i=0; i<numRecords; i++) {
                const randT = Math.floor(Math.random() * titles.length);
                const assignedDentist = dentists[Math.floor(Math.random() * dentists.length)];
                // Cycle through branches to ensure even distribution
                const assignedBranch = branches[count % branches.length];
                
                await TreatmentRecord.create({
                    patient: patient._id,
                    dentist: assignedDentist._id,
                    branch: assignedBranch._id,
                    title: titles[randT],
                    procedures: procs[randT],
                    notes: "Routine dental procedure.",
                    prescriptions: "None required",
                    cost: 5000 + (Math.floor(Math.random() * 5) * 1000),
                    paid: true,
                    date: new Date(now.getTime() - (i * 86400000)) // Yesterday and Today
                });
                count++;
            }
        }

        console.log(`Successfully seeded ${count} treatments across all branches for CURRENT MONTH test.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seedData();

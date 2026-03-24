import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TreatmentRecord from './models/TreatmentRecord.js';
import Branch from './models/Branch.js';

dotenv.config({ path: '.env' });

async function fixBranches() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const branches = await Branch.find();
        if (branches.length === 0) {
            console.log("No branches found in DB!");
            process.exit(1);
        }

        const treatments = await TreatmentRecord.find();
        for (let t of treatments) {
            if (!t.branch) {
                t.branch = branches[Math.floor(Math.random() * branches.length)]._id;
                await t.save();
            }
        }
        console.log("Updated treatments with branches");
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
fixBranches();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TreatmentRecord from './models/TreatmentRecord.js';
import Branch from './models/Branch.js';

dotenv.config({ path: '.env' });

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const branches = await Branch.find();
        console.log('Branches in DB:');
        branches.forEach(b => console.log(`- ${b.name} (${b._id})`));

        const treatments = await TreatmentRecord.find().populate('branch', 'name').limit(5);
        console.log('\nSample Treatment Records:');
        treatments.forEach(t => {
            console.log(`- Treatment with branch: ${t.branch?.name || t.branch || 'MISSING'}`);
        });
        
        const count = await TreatmentRecord.countDocuments();
        console.log(`\nTotal treatment records: ${count}`);

        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
checkData();

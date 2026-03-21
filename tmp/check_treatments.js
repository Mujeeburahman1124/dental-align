import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TreatmentRecord from '../server/models/TreatmentRecord.js';
import User from '../server/models/User.js';

dotenv.config({ path: './server/.env' });

async function check() {
    await mongoose.connect(process.env.MONGO_URI);

    const users = await User.find({ role: { $in: ['patient', 'guest'] } }).select('fullName role _id');

    const results = [];
    for (const u of users) {
        const ct = await TreatmentRecord.countDocuments({ patient: u._id });
        results.push({ name: u.fullName, role: u.role, count: ct, id: u._id.toString() });
    }

    // Also check Salha specifically
    const salha = await User.findOne({ fullName: /salha/i }).select('fullName role _id');
    const salhaCount = salha ? await TreatmentRecord.countDocuments({ patient: salha._id }) : 'NOT FOUND';

    const total = await TreatmentRecord.countDocuments({});

    console.log(JSON.stringify({ results, salha: salha ? { name: salha.fullName, role: salha.role, id: salha._id.toString(), treatments: salhaCount } : null, total }, null, 2));

    process.exit(0);
}

check();

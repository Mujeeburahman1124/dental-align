import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const checkDentists = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const dentists = await User.find({ role: 'dentist' });
        console.log(`TOTAL DENTISTS FOUND: ${dentists.length}`);
        dentists.forEach(d => console.log(`- ${d.fullName} (${d.specialization || 'No Specialization'})`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDentists();

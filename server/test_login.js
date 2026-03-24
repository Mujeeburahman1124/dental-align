import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'mitchell@dentalign.com' });
        if (!user) {
            console.log('Not found');
            process.exit(1);
        }

        const match = await bcrypt.compare('password123', user.password);
        console.log('Raw comparison for "password123":', match);
        
        const methodMatch = await user.matchPassword('password123');
        console.log('Method comparison:', methodMatch);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
test();

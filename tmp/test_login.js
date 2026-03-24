import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config({ path: '../server/.env' });

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'dentist@dentalign.com';
    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found!');
        process.exit(0);
    }
    console.log('User password hash:', user.password);
    const match = await user.matchPassword('password123');
    console.log('Does password123 match?:', match);
    process.exit(0);
}

test();

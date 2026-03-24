import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'mitchell@dentalign.com' });
        if (user) {
            console.log('User found:', {
                email: user.email,
                role: user.role,
                hash: user.password ? 'Exists' : 'Missing'
            });
        } else {
            console.log('User mitchell@dentalign.com NOT FOUND');
            const all = await User.find().limit(5);
            console.log('Other users:', all.map(u => u.email));
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();

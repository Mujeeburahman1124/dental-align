import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const manageData = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const count = await User.countDocuments();
        console.log(`Current User Count: ${count}`);

        if (count === 0) {
            console.log('Creating Admin User...');
            try {
                await User.create({
                    fullName: 'Admin User',
                    email: 'admin@dentalalign.com',
                    phone: '0000000000',
                    password: 'admin',
                    role: 'admin'
                });
                console.log('✅ Admin Created');
            } catch (e) {
                console.error('❌ Failed to create Admin:', e.message);
            }

            console.log('Creating Dentist...');
            try {
                await User.create({
                    fullName: 'Dr. Muksith',
                    email: 'dentist@dentalalign.com',
                    phone: '0777123456',
                    password: 'dentist',
                    role: 'dentist',
                    slmcNumber: 'SLMC-123',
                    specialization: 'General'
                });
                console.log('✅ Dentist Created');
            } catch (e) {
                console.error('❌ Failed to create Dentist:', e.message);
            }

        } else {
            console.log('Users exist:');
            const users = await User.find({}, 'email role');
            users.forEach(u => console.log(` - ${u.email} (${u.role})`));
        }

        process.exit(0);
    } catch (error) {
        console.error('Fatal Error:', error);
        process.exit(1);
    }
};

manageData();

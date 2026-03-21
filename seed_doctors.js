import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';

dotenv.config({ path: './server/.env' });

const doctors = [
    {
        fullName: 'Dr. James Wilson',
        email: 'james.wilson@dentalign.com',
        phone: '0710000000',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10000',
        specialization: 'General Dentistry',
        createdAt: new Date('2020-01-15') // One of the first two
    },
    {
        fullName: 'Dr. Sarah Mitchell',
        email: 'sarah.mitchell@dentalign.com',
        phone: '0717234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10007',
        specialization: 'Orthodontics',
        createdAt: new Date('2020-02-20') // Second of the first two
    },
    {
        fullName: 'Dr. Aqeela',
        email: 'aqeela@dentalign.com',
        phone: '0711234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10001',
        specialization: 'Orthodontics',
        createdAt: new Date('2021-03-10')
    },
    {
        fullName: 'Dr. Muksith',
        email: 'muksith@dentalign.com',
        phone: '0712234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10002',
        specialization: 'Oral Surgery',
        createdAt: new Date('2022-05-15')
    },
    {
        fullName: 'Dr. Rahman',
        email: 'rahman@dentalign.com',
        phone: '0713234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10003',
        specialization: 'Periodontics',
        createdAt: new Date('2023-08-20')
    },
    {
        fullName: 'Dr. Sivakumar',
        email: 'sivakumar@dentalign.com',
        phone: '0714234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10004',
        specialization: 'Endodontics',
        createdAt: new Date('2024-01-10')
    },
    {
        fullName: 'Dr. Bandara',
        email: 'bandara@dentalign.com',
        phone: '0715234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10005',
        specialization: 'General Dentistry',
        createdAt: new Date('2024-06-15')
    },
    {
        fullName: 'Dr. Wickramasinghe',
        email: 'wickramasinghe@dentalign.com',
        phone: '0716234567',
        password: 'password123',
        role: 'dentist',
        slmcNumber: 'SLMC-10006',
        specialization: 'Pediatric Dentistry',
        createdAt: new Date('2025-01-10')
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const dr of doctors) {
            const exists = await User.findOne({ email: dr.email });
            if (!exists) {
                await User.create(dr);
                console.log(`Created: ${dr.fullName}`);
            } else {
                console.log(`Already exists: ${dr.fullName}`);
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
}

seed();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config({ path: './server/.env' });

async function fixDates() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const updates = [
            { email: 'admin@dentalign.com', date: '2020-01-01' },
            { email: 'staff@dentalign.com', date: '2020-01-05' },
            { email: 'james.wilson@dentalign.com', date: '2020-01-15' },
            { email: 'sarah.mitchell@dentalign.com', date: '2020-02-20' },
            { email: 'dentist@dentalign.com', date: '2020-02-20' },
            { email: 'aqeela@dentalign.com', date: '2021-03-10' },
            { email: 'muksith@dentalign.com', date: '2022-05-15' },
            { email: 'rahman@dentalign.com', date: '2023-08-20' },
            { email: 'sivakumar@dentalign.com', date: '2024-01-10' },
            { email: 'bandara@dentalign.com', date: '2024-06-15' },
            { email: 'wickramasinghe@dentalign.com', date: '2025-01-10' },
        ];

        for (const up of updates) {
            const res = await User.updateOne(
                { email: up.email },
                { $set: { createdAt: new Date(up.date) } }
            );
            if (res.modifiedCount > 0) {
                console.log(`Updated ${up.email} to ${up.date}`);
            }
        }

        // Also fix some patients to be older
        await User.updateMany(
            { role: 'patient', createdAt: { $gt: new Date('2026-01-01') } },
            [
                {
                    $set: {
                        createdAt: {
                            $dateFromParts: {
                                year: 2024,
                                month: { $add: [1, { $floor: { $multiply: [11, { $rand: {} }] } }] },
                                day: { $add: [1, { $floor: { $multiply: [27, { $rand: {} }] } }] }
                            }
                        }
                    }
                }
            ]
        );

        console.log('Finished fixing historical dates.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDates();

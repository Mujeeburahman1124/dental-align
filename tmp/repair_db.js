import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function patch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const users = db.collection('users');

        const doctors = [
            { email: 'james.wilson@dentalign.com', date: '2020-01-15' },
            { email: 'sarah.mitchell@dentalign.com', date: '2020-02-20' },
            { email: 'dentist@dentalign.com', date: '2020-02-20' },
            { email: 'aqeela@dentalign.com', date: '2021-03-10' },
            { email: 'muksith@dentalign.com', date: '2022-05-15' },
            { email: 'rahman@dentalign.com', date: '2023-08-20' },
            { email: 'sivakumar@dentalign.com', date: '2024-01-10' },
            { email: 'bandara@dentalign.com', date: '2024-06-15' },
            { email: 'wickramasinghe@dentalign.com', date: '2025-01-10' },
            { email: 'admin@dentalign.com', date: '2020-01-01' },
            { email: 'staff@dentalign.com', date: '2020-01-05' }
        ];

        for (const dr of doctors) {
            await users.updateOne(
                { email: dr.email },
                { $set: { createdAt: new Date(dr.date) } }
            );
            console.log(`Patched ${dr.email}`);
        }

        // Randomly age patients to 2024-2025
        const patients = await users.find({ role: 'patient' }).toArray();
        for (const p of patients) {
            const year = Math.random() > 0.5 ? 2024 : 2025;
            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;
            await users.updateOne({ _id: p._id }, { $set: { createdAt: new Date(year, month, day) } });
        }

        console.log('Database repair successful.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
patch();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';
import TreatmentRecord from '../server/models/TreatmentRecord.js';
import Appointment from '../server/models/Appointment.js';
import Branch from '../server/models/Branch.js';

dotenv.config({ path: './server/.env' });

async function seedHistory() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for final seeding...');

        const dentists = await User.find({ role: 'dentist' });
        const patients = await User.find({ role: 'patient' });
        const branch = await Branch.findOne();

        if (!branch) {
            console.error('No branch found. Creating default one.');
            const newBranch = await Branch.create({ name: 'Colombo Main', location: 'Colombo 03' });
            branch = newBranch;
        }

        const templates = [
            { title: 'Root Canal Therapy', cost: 25000, reason: 'Severe toothache' },
            { title: 'Orthodontic Checkup', cost: 15000, reason: 'Braces adjustment' },
            { title: 'Scaling & Polishing', cost: 5000, reason: 'Routine cleaning' },
            { title: 'Composite Filling', cost: 8000, reason: 'Cavity treatment' },
            { title: 'Teeth Whitening', cost: 22000, reason: 'Cosmetic enhancement' },
            { title: 'Wisdom Extraction', cost: 35000, reason: 'Impacted molar' }
        ];

        // Seed 2026 data specifically for "Month" and "Year" to look BIG
        const records = [];
        const appointments = [];

        // Add 60 records for Jan/Feb 2026
        for (let i = 0; i < 60; i++) {
            const month = Math.random() > 0.5 ? 0 : 1; // Jan or Feb
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(2026, month, day);
            const doc = dentists[Math.floor(Math.random() * dentists.length)];
            const pat = patients[Math.floor(Math.random() * patients.length)];
            const temp = templates[Math.floor(Math.random() * templates.length)];

            const cost = temp.cost + (Math.floor(Math.random() * 4000) - 2000);

            records.push({
                patient: pat._id,
                dentist: doc._id,
                title: temp.title,
                cost: cost,
                doctorFee: Math.round(cost * 0.4),
                date: date,
                paid: true,
                procedures: [temp.title],
                notes: 'Advanced treatment record'
            });

            appointments.push({
                patient: pat._id,
                dentist: doc._id,
                branch: branch._id,
                date: date,
                time: '10:00 AM',
                status: 'completed',
                serviceName: temp.title,
                reason: temp.reason,
                isFeePaid: true
            });
        }

        // Add 100 historical records for 2025 to make "Year Trend" look good
        for (let i = 0; i < 100; i++) {
            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(2025, month, day);
            const doc = dentists[Math.floor(Math.random() * dentists.length)];
            const pat = patients[Math.floor(Math.random() * patients.length)];
            const temp = templates[Math.floor(Math.random() * templates.length)];

            const cost = temp.cost + (Math.floor(Math.random() * 4000) - 2000);

            records.push({
                patient: pat._id,
                dentist: doc._id,
                title: temp.title,
                cost: cost,
                doctorFee: Math.round(cost * 0.4),
                date: date,
                paid: true,
                procedures: [temp.title],
                notes: 'Historical record'
            });
        }

        console.log(`Inserting ${records.length} records...`);
        await TreatmentRecord.insertMany(records);
        await Appointment.insertMany(appointments);

        console.log('Seeding successful!');
        process.exit(0);
    } catch (err) {
        console.error('FAIL:', err.message);
        process.exit(1);
    }
}
seedHistory();

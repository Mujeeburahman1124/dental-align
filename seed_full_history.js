import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';
import TreatmentRecord from './server/models/TreatmentRecord.js';
import Appointment from './server/models/Appointment.js';
import Branch from './server/models/Branch.js';

dotenv.config({ path: './server/.env' });

async function seedHistory() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for full history seeding...');

        const patients = await User.find({ role: { $in: ['patient', 'guest'] } });
        const dentists = await User.find({ role: 'dentist' });
        const branches = await Branch.find();

        if (!patients.length || !dentists.length || !branches.length) {
            console.log('Missing basic data. Run other seeds first.');
            process.exit(1);
        }

        // Clear existing to avoid duplicates if desired, but here we just ADD
        // await TreatmentRecord.deleteMany({});
        // await Appointment.deleteMany({});

        const treatments = [];
        const appts = [];

        const services = [
            { name: 'Root Canal Therapy', cost: 15000, fee: 6000 },
            { name: 'Full Scaling & Polishing', cost: 4500, fee: 2000 },
            { name: 'Teeth Whitening Premium', cost: 25000, fee: 10000 },
            { name: 'Surgical Extraction', cost: 8500, fee: 3500 },
            { name: 'Consultation & X-Ray', cost: 2500, fee: 1000 },
            { name: 'Orthodontic Braces Charge', cost: 120000, fee: 50000 }
        ];

        console.log(`Generating history for ${patients.length} patients across 2 years...`);

        // Generate 300-500 random records over the last 24 months
        for (let i = 0; i < 400; i++) {
            const pat = patients[Math.floor(Math.random() * patients.length)];
            const dent = dentists[Math.floor(Math.random() * dentists.length)];
            const branch = branches[Math.floor(Math.random() * branches.length)];
            const svc = services[Math.floor(Math.random() * services.length)];

            // Random date in last 2 years
            const randomDaysAgo = Math.floor(Math.random() * 730);
            const date = new Date(Date.now() - (randomDaysAgo * 24 * 60 * 60 * 1000));

            const isPaid = Math.random() > 0.15; // 85% paid

            treatments.push({
                patient: pat._id,
                dentist: dent._id,
                title: svc.name,
                procedures: [svc.name],
                notes: 'System generated history.',
                cost: svc.cost,
                doctorFee: svc.fee,
                paid: isPaid,
                date: date
            });

            appts.push({
                patient: pat._id,
                dentist: dent._id,
                branch: branch._id,
                date: date,
                time: '10:00 AM',
                status: 'completed',
                reason: svc.name,
                serviceName: svc.name,
                bookingFee: 500,
                isFeePaid: isPaid
            });
        }

        await TreatmentRecord.insertMany(treatments);
        await Appointment.insertMany(appts);

        console.log(`Successfully seeded ${treatments.length} historical records.`);
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedHistory();

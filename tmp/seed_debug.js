import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';
import TreatmentRecord from '../server/models/TreatmentRecord.js';
import Appointment from '../server/models/Appointment.js';

dotenv.config({ path: './server/.env' });

async function seedHistory() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const dentists = await User.find({ role: 'dentist' });
        const patients = await User.find({ role: 'patient' });

        const year = 2026;
        const month = 1; // Feb
        for (let i = 0; i < 50; i++) {
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(year, month, day);
            const doc = dentists[Math.floor(Math.random() * dentists.length)];
            const pat = patients[Math.floor(Math.random() * patients.length)];

            const cost = 12000 + Math.floor(Math.random() * 5000);

            const rec = new TreatmentRecord({
                patient: pat._id,
                dentist: doc._id,
                title: 'General Consultation',
                cost: cost,
                doctorFee: Math.round(cost * 0.4),
                date: date,
                paid: true
            });
            await rec.save();

            const appt = new Appointment({
                patient: pat._id,
                dentist: doc._id,
                date: date,
                time: '09:00 AM',
                status: 'completed',
                serviceName: 'General Consultation',
                isFeePaid: true
            });
            await appt.save();
        }
        console.log('Success');
        process.exit(0);
    } catch (err) {
        console.error('FAIL:', err.message);
        if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
        process.exit(1);
    }
}
seedHistory();

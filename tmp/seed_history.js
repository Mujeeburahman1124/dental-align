import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';
import TreatmentRecord from '../server/models/TreatmentRecord.js';
import Appointment from '../server/models/Appointment.js';

dotenv.config({ path: './server/.env' });

async function seedHistory() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for massive seeding...');

        const dentists = await User.find({ role: 'dentist' });
        const patients = await User.find({ role: 'patient' });

        if (dentists.length === 0 || patients.length === 0) {
            console.error('No doctors or patients found. Run normal seed first.');
            process.exit(1);
        }

        const treatments = [
            { title: 'Root Canal Therapy', cost: 25000 },
            { title: 'Dental Braces Adjustment', cost: 15000 },
            { title: 'Full Scaling & Polishing', cost: 5000 },
            { title: 'Composite Filling', cost: 8000 },
            { title: 'Teeth Whitening', cost: 20000 },
            { title: 'Wisdom Tooth Extraction', cost: 35000 },
            { title: 'Dental Implant Consultation', cost: 3000 },
            { title: 'Bridge Realignment', cost: 12000 }
        ];

        const records = [];
        const appointments = [];

        // Generate data from 2020 to Feb 2026
        for (let year = 2020; year <= 2026; year++) {
            const endMonth = (year === 2026) ? 1 : 11; // Feb 2026 is month 1
            for (let month = 0; month <= endMonth; month++) {
                // Number of treatments increases over years
                const count = (year - 2019) * 5 + Math.floor(Math.random() * 5);

                for (let i = 0; i < count; i++) {
                    const day = Math.floor(Math.random() * 28) + 1;
                    const date = new Date(year, month, day);
                    const doc = dentists[Math.floor(Math.random() * dentists.length)];
                    const pat = patients[Math.floor(Math.random() * patients.length)];
                    const template = treatments[Math.floor(Math.random() * treatments.length)];

                    const cost = template.cost + (Math.floor(Math.random() * 2000) - 1000);
                    const drFee = Math.round(cost * 0.4);

                    records.push({
                        patient: pat._id,
                        dentist: doc._id,
                        title: template.title,
                        cost: cost,
                        doctorFee: drFee,
                        date: date,
                        paid: true,
                        procedures: ['Standard Procedure'],
                        notes: 'Historical record'
                    });

                    // Also generate corresponding appointments to fix "12 appts but 7 patients" metrics
                    appointments.push({
                        patient: pat._id,
                        dentist: doc._id,
                        date: date,
                        time: '10:00 AM',
                        status: 'completed',
                        serviceName: template.title,
                        isFeePaid: true
                    });
                }
            }
        }

        console.log(`Inserting ${records.length} historical records...`);
        try {
            await TreatmentRecord.insertMany(records);
            await Appointment.insertMany(appointments);
        } catch (validationError) {
            console.error('Validation Error Details:', JSON.stringify(validationError, null, 2));
            throw validationError;
        }

        console.log('Massive history seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedHistory();

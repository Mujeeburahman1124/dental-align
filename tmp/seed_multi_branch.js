import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';
import TreatmentRecord from '../server/models/TreatmentRecord.js';
import Appointment from '../server/models/Appointment.js';
import Branch from '../server/models/Branch.js';

dotenv.config({ path: './server/.env' });

async function seedMultiBranch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecting for professional multi-branch seeding...');

        // Clear only history, keep users/branches
        await TreatmentRecord.deleteMany({});
        await Appointment.deleteMany({});

        // Ensure 3 branches exist
        const branchNames = ['Kurunegala Main', 'Kandy Central', 'Colombo Elite'];
        let branches = await Branch.find({ name: { $in: branchNames } });

        if (branches.length < 3) {
            console.log('Replacing/Cleaning branches for accurate reporting...');
            await Branch.deleteMany({});
            branches = await Branch.insertMany([
                { name: 'Kurunegala Main', location: 'Kurunegala Town' },
                { name: 'Kandy Central', location: 'Commercial Complex, Kandy' },
                { name: 'Colombo Elite', location: 'Bambalapitiya, Colombo 03' }
            ]);
        }

        const dentists = await User.find({ role: 'dentist' });
        const patients = await User.find({ role: 'patient' });

        if (!dentists.length || !patients.length) {
            console.error('Wait! Seed your users first.');
            process.exit(1);
        }

        const services = [
            { title: 'Root Canal', cost: 18000, reason: 'Pain Management' },
            { title: 'Orthodontics', cost: 45000, reason: 'Braces Fitting' },
            { title: 'Dental Filling', cost: 4500, reason: 'Cavity Repair' },
            { title: 'Teeth Whitening', cost: 15000, reason: 'Cosmetic' },
            { title: 'Checkup', cost: 2500, reason: 'Regular Visit' },
            { title: 'Scaling', cost: 6000, reason: 'Gum Health' }
        ];

        const records = [];
        const appointments = [];

        // Seed 2026 data specifically (Month 0: Jan, Month 1: Feb)
        // Aiming for ~800k - 1M per month total
        for (let month = 0; month <= 1; month++) {
            const daysInMonth = (month === 1) ? 28 : 31;
            for (let day = 1; day <= daysInMonth; day = day + 1.5) { // Roughly 20 unique sessions per month across clinic
                // For each session, multiple patients (like in reality)
                const sessionCount = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < sessionCount; i++) {
                    const date = new Date(2026, month, Math.floor(day));
                    const branch = branches[Math.floor(Math.random() * branches.length)];
                    const doc = dentists[Math.floor(Math.random() * dentists.length)];
                    const pat = patients[Math.floor(Math.random() * patients.length)];
                    const service = services[Math.floor(Math.random() * services.length)];

                    const cost = service.cost + (Math.floor(Math.random() * 2000) - 1000);
                    const isCompleted = (date < new Date());

                    if (isCompleted) {
                        records.push({
                            patient: pat._id,
                            dentist: doc._id,
                            title: service.title,
                            cost: cost,
                            doctorFee: Math.round(cost * 0.4),
                            date: date,
                            paid: true,
                            procedures: [service.title],
                            notes: 'Completed successfully.'
                        });
                    }

                    appointments.push({
                        patient: pat._id,
                        dentist: doc._id,
                        branch: branch._id,
                        date: date,
                        time: i + 9 + ':00 AM',
                        status: isCompleted ? 'completed' : 'confirmed',
                        serviceName: service.title,
                        reason: service.reason,
                        isFeePaid: true
                    });
                }
            }
        }

        // Add some historical 2025 growth
        for (let month = 0; month < 12; month++) {
            for (let i = 0; i < 15; i++) {
                const day = Math.floor(Math.random() * 28) + 1;
                const date = new Date(2025, month, day);
                const doc = dentists[Math.floor(Math.random() * dentists.length)];
                const pat = patients[Math.floor(Math.random() * patients.length)];
                const service = services[Math.floor(Math.random() * services.length)];
                const cost = service.cost + 500;

                records.push({
                    patient: pat._id,
                    dentist: doc._id,
                    title: service.title,
                    cost: cost,
                    doctorFee: Math.round(cost * 0.4),
                    date: date,
                    paid: true
                });
            }
        }

        console.log(`Finalizing: ${records.length} treatments and ${appointments.length} appointments across 3 branches.`);
        await TreatmentRecord.insertMany(records);
        await Appointment.insertMany(appointments);

        console.log('Branch-aware seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedMultiBranch();

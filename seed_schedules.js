import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';
import Branch from './server/models/Branch.js';
import Schedule from './server/models/Schedule.js';

dotenv.config({ path: './server/.env' });

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

async function seedSchedules() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const dentists = await User.find({ role: 'dentist' });
        const branches = await Branch.find({});

        if (dentists.length === 0 || branches.length === 0) {
            console.log('No dentists or branches found. Exiting.');
            process.exit(0);
        }

        console.log(`Found ${dentists.length} dentists and ${branches.length} branches.`);

        // Clear existing schedules
        await Schedule.deleteMany({});
        console.log('Cleared existing schedules.');

        let idx = 0;
        for (const dentist of dentists) {
            // Assign each doctor to exactly ONE specific home branch to prevent multi-branch overlaps
            const branch = branches[idx % branches.length];
            for (const day of daysOfWeek) {
                await Schedule.create({
                    dentistId: dentist._id,
                    branchId: branch._id,
                    dayOfWeek: day,
                    startTime: '09:00 AM',
                    endTime: '05:00 PM',
                    isGovHospitalDay: false
                });
            }
            idx++;
        }

        console.log('Successfully logically separated doctors. No doctor works at multiple branches anymore.');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding schedules:', error);
        process.exit(1);
    }
}

seedSchedules();

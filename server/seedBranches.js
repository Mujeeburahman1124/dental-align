import mongoose from 'mongoose';
import Branch from './models/Branch.js';
import User from './models/User.js';
import Schedule from './models/Schedule.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const seedBranchesAndSchedules = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dental-align');
        console.log('Connected to MongoDB for branch seeding...');

        // Clear existing branches and schedules
        await Branch.deleteMany();
        await Schedule.deleteMany();

        // Create Branches
        const kurunegala = await Branch.create({
            name: 'Kurunegala Branch',
            location: 'Colombo Road, Kurunegala',
            contactNumber: '0371234567'
        });

        const kandy = await Branch.create({
            name: 'Kandy Branch',
            location: 'Peradeniya Road, Kandy',
            contactNumber: '0817654321'
        });

        const colombo = await Branch.create({
            name: 'Colombo Branch',
            location: 'Galle Road, Colombo 03',
            contactNumber: '0119876543'
        });

        console.log('Branches created.');

        // Get dentists
        const dentists = await User.find({ role: 'dentist' });

        if (dentists.length === 0) {
            console.log('No dentists found. Please run seed.js first.');
            process.exit();
        }

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const branches = [kurunegala, kandy, colombo];

        for (const dentist of dentists) {
            for (let i = 0; i < days.length; i++) {
                const day = days[i];
                // Assign to different branches based on day
                const branchIdx = i % 3;

                // Example: Thursday is Govt Hospital Day for some
                const isGovDay = (day === 'Thursday' && dentist.fullName.includes('Sarah'));

                await Schedule.create({
                    dentistId: dentist._id,
                    branchId: branches[branchIdx]._id,
                    dayOfWeek: day,
                    startTime: '09:00 AM',
                    endTime: '05:00 PM',
                    isGovHospitalDay: isGovDay
                });
            }
        }

        console.log('Schedules created.');
        console.log('BRANCH AND SCHEDULE SEEDING COMPLETED!');
        process.exit();
    } catch (error) {
        console.error('Error seeding branches:', error.message);
        process.exit(1);
    }
};

seedBranchesAndSchedules();

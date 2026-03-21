import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config({ path: './server/.env' });

async function backdateUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        const rolesToBackdate = ['admin', 'staff', 'dentist'];

        for (const user of users) {
            let randomYear;
            if (rolesToBackdate.includes(user.role)) {
                // Staff/Admin joined earlier (2020-2022)
                randomYear = Math.floor(Math.random() * (2022 - 2020 + 1)) + 2020;
            } else {
                // Patients joined 2023-2025
                randomYear = Math.floor(Math.random() * (2025 - 2023 + 1)) + 2023;
            }

            const randomMonth = Math.floor(Math.random() * 12);
            const randomDay = Math.floor(Math.random() * 28) + 1;
            const backdatedDate = new Date(randomYear, randomMonth, randomDay);

            // Use findByIdAndUpdate to bypass timestamps if possible, 
            // but since we want to CHANGE createdAt, we need to do this:
            await User.updateOne(
                { _id: user._id },
                { $set: { createdAt: backdatedDate } }
            );
        }

        console.log('Successfully backdated all users to 2020-2025 range.');
        process.exit(0);

    } catch (error) {
        console.error('Error backdating users:', error);
        process.exit(1);
    }
}

backdateUsers();

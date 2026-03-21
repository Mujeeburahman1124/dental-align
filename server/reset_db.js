import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const clearData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for cleaning...');

        const collections = ['appointments', 'treatmentrecords', 'payments', 'notifications'];

        for (const col of collections) {
            try {
                await mongoose.connection.db.collection(col).deleteMany({});
                console.log(`Cleared ${col}`);
            } catch (err) {
                console.log(`Collection ${col} not found or error clearing: ${err.message}`);
            }
        }

        // Handle users separately to preserve dentists
        try {
            const result = await mongoose.connection.db.collection('users').deleteMany({ role: { $ne: 'dentist' } });
            console.log(`Cleared users (preserved dentists): ${result.deletedCount} users removed`);
        } catch (err) {
            console.log(`Error clearing users: ${err.message}`);
        }

        console.log('Database cleaned successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    }
};

clearData();

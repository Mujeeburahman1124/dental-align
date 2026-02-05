import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from current directory
dotenv.config({ path: join(__dirname, '.env') });

console.log('⏳ Testing MongoDB Atlas Connection...');
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('❌ MONGO_URI is missing in .env');
    process.exit(1);
}

// Log masked URI for verification
console.log(`🔗 Target Host: ${uri.split('@')[1]?.split('/')[0]}`);

try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    console.log(`🗄️  Database: ${mongoose.connection.name}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected cleanly.');
    process.exit(0);
} catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
}

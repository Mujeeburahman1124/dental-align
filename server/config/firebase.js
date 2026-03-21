import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

try {
    const serviceAccountPath = join(__dirname, 'firebase-service-account.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
    });
    console.log('✅ Firebase Admin initialized successfully using service account file');
} catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    console.warn('Firebase features (like Google Login) might not work correctly.');
}

export default admin;

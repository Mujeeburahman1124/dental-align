import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES Module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Import routes dynamically for ES modules
const authRoutes = await import('./routes/auth.js');
const appointmentRoutes = await import('./routes/appointments.js');
const userRoutes = await import('./routes/users.js');
const treatmentRoutes = await import('./routes/treatments.js');
const paymentRoutes = await import('./routes/payments.js');
const notificationRoutes = await import('./routes/notifications.js');
const clinicSettingsRoutes = await import('./routes/clinicSettings.js');

// Routes
app.use('/api/auth', authRoutes.default);
app.use('/api/appointments', appointmentRoutes.default);
app.use('/api/users', userRoutes.default);
app.use('/api/treatments', treatmentRoutes.default);
app.use('/api/payments', paymentRoutes.default);
app.use('/api/notifications', notificationRoutes.default);
app.use('/api/settings', clinicSettingsRoutes.default);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'DentAlign API is running!' });
});

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('DentAlign API is running...');
});

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 API URL: http://localhost:${PORT}`);
    });
});

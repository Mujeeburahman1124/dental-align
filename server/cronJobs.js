import cron from 'node-cron';
import Appointment from './models/Appointment.js';

/**
 * Appointment Status Automation
 * Rules:
 * 1. If an appointment's date is in the past and status is 'pending' or 'confirmed', 
 *    mark it as 'expired'.
 */
export const initCronJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running daily appointment status audit...');

            const now = new Date();
            now.setHours(0, 0, 0, 0); // Start of today

            const result = await Appointment.updateMany(
                {
                    date: { $lt: now },
                    status: { $in: ['pending', 'confirmed'] }
                },
                { status: 'expired' }
            );

            console.log(`Successfully expired ${result.modifiedCount} past appointments.`);
        } catch (error) {
            console.error('Error in appointment audit cron job:', error);
        }
    });

    // Optional: Run every hour to catch same-day expirations (optional based on requirements)
    // cron.schedule('0 * * * *', async () => { ... });
};

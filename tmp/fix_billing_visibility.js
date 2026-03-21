import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';
import TreatmentRecord from '../server/models/TreatmentRecord.js';
import Appointment from '../server/models/Appointment.js';
import Branch from '../server/models/Branch.js';

dotenv.config({ path: './server/.env' });

async function fixBilling() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const patients = await User.find({ role: 'patient' });
        const dentists = await User.find({ role: 'dentist' });
        const branches = await Branch.find();

        if (!patients.length || !dentists.length || !branches.length) {
            console.log('Missing data to fix billing.');
            process.exit(1);
        }

        console.log(`Adding unpaid treatments for ${patients.length} patients...`);

        const newRecords = [];
        const newAppointments = [];

        for (const pat of patients) {
            // Check if patient already has unpaid bills
            const unpaid = await TreatmentRecord.countDocuments({ patient: pat._id, paid: false });
            if (unpaid === 0) {
                // Add one significant unpaid treatment
                newRecords.push({
                    patient: pat._id,
                    dentist: dentists[0]._id,
                    title: 'Orthodontic Consultation & Braces Adjustment',
                    procedures: ['Consultation', 'Tightening', 'Clean'],
                    notes: 'Follow-up needed in 4 weeks.',
                    cost: 12500,
                    doctorFee: 5000,
                    paid: false, // CRITICAL: Mark as unpaid
                    date: new Date()
                });
            }

            // Also ensure they have one unpaid booking fee
            const unpaidBooking = await Appointment.countDocuments({ patient: pat._id, isFeePaid: false, status: { $ne: 'cancelled' } });
            if (unpaidBooking === 0) {
                newAppointments.push({
                    patient: pat._id,
                    dentist: dentists[0]._id,
                    branch: branches[0]._id,
                    date: new Date(Date.now() + 86400000 * 2), // Tomorrow
                    time: '10:30 AM',
                    status: 'confirmed',
                    reason: 'Emergency Tooth Extraction',
                    serviceName: 'Surgery',
                    bookingFee: 500,
                    isFeePaid: false // CRITICAL: Mark as unpaid
                });
            }
        }

        if (newRecords.length > 0) await TreatmentRecord.insertMany(newRecords);
        if (newAppointments.length > 0) await Appointment.insertMany(newAppointments);

        console.log(`Billed ${newRecords.length} treatments and ${newAppointments.length} appointments.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixBilling();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import TreatmentRecord from './models/TreatmentRecord.js';
import Payment from './models/Payment.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dental-align');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Appointment.deleteMany();
        await TreatmentRecord.deleteMany();
        await Payment.deleteMany();

        // CREATE USERS
        // Note: Password hashing is handled by User model pre-save hook
        const admin = await User.create({
            fullName: 'Clinic Administrator',
            email: 'admin@dentalign.com',
            phone: '0771234567',
            password: 'password123',
            role: 'admin'
        });

        const staff = await User.create({
            fullName: 'Front Desk Staff',
            email: 'staff@dentalign.com',
            phone: '0777654321',
            password: 'password123',
            role: 'staff'
        });

        const dentist = await User.create({
            fullName: 'Dr. Sarah Mitchell',
            email: 'dentist@dentalign.com',
            phone: '0779876543',
            password: 'password123',
            role: 'dentist',
            slmcNumber: 'SLMC-9988',
            specialization: 'Orthodontics'
        });

        const patient = await User.create({
            fullName: 'Mohamed Rizwan',
            email: 'patient@dentalign.com',
            phone: '0712345678',
            password: 'password123',
            role: 'patient'
        });

        console.log('Users Seeded.');

        // CREATE APPOINTMENTS
        const appt1 = await Appointment.create({
            patient: patient._id,
            dentist: dentist._id,
            date: new Date('2026-02-10'),
            time: '10:30 AM',
            reason: 'Annual Checkup',
            serviceName: 'Dental Checkup',
            estimatedCost: 2500,
            status: 'confirmed',
            isFeePaid: true
        });

        const appt2 = await Appointment.create({
            patient: patient._id,
            dentist: dentist._id,
            date: new Date('2026-02-15'),
            time: '02:30 PM',
            reason: 'Teeth Whitening Procedure',
            serviceName: 'Teeth Whitening',
            estimatedCost: 15000,
            status: 'pending',
            isFeePaid: false
        });

        console.log('Appointments Seeded.');

        // CREATE TREATMENT RECORDS
        const record1 = await TreatmentRecord.create({
            patient: patient._id,
            dentist: dentist._id,
            title: 'Deep Cleaning & Scaling',
            procedures: ['Scaling', 'Polishing', 'Fluoride Application'],
            notes: 'Minor gum inflammation. Advised flossing twice daily.',
            date: new Date('2026-01-20'),
            cost: 4500,
            paid: true
        });

        const record2 = await TreatmentRecord.create({
            patient: patient._id,
            dentist: dentist._id,
            title: 'Composite Filling - Tooth #14',
            procedures: ['Cavity Prep', 'Resin Filling'],
            notes: 'Secondary molar restored.',
            date: new Date('2026-01-25'),
            cost: 6000,
            paid: false
        });

        console.log('Treatment Records Seeded.');

        // CREATE PAYMENTS
        await Payment.create({
            patient: patient._id,
            appointment: appt1._id,
            amount: 500,
            paymentType: 'booking_fee',
            status: 'completed',
            transactionId: 'TXN-ABC123456'
        });

        await Payment.create({
            patient: patient._id,
            treatment: record1._id,
            amount: 4500,
            paymentType: 'treatment_fee',
            status: 'completed',
            transactionId: 'TXN-XYZ987654'
        });

        console.log('Payments Seeded.');

        console.log('DATABASE SEEDED SUCCESSFULLY!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`- ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedData();

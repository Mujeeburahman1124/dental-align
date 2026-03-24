import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config({ path: 'server/.env' });

const patientsData = [
    { fullName: 'Emma Watson', email: 'emma.p@example.com', phone: '0771234001', role: 'patient' },
    { fullName: 'John Doe', email: 'john.d@example.com', phone: '0771234002', role: 'patient' },
    { fullName: 'Alice Fernando', email: 'alice.f@example.com', phone: '0771234003', role: 'patient' },
    { fullName: 'Zainab Mansoor', email: 'zainab.m@example.com', phone: '0771234004', role: 'patient' },
    { fullName: 'Kavindu Perera', email: 'kavindu.p@example.com', phone: '0771234005', role: 'patient' },
    { fullName: 'Sarah Silva', email: 'sarah.s@example.com', phone: '0771234006', role: 'patient' },
    { fullName: 'Mohamed Rikas', email: 'mohamed.r@example.com', phone: '0771234007', role: 'patient' },
    { fullName: 'Tharushi Bandara', email: 'tharushi.b@example.com', phone: '0771234008', role: 'patient' },
    { fullName: 'Nuwan Jayasinghe', email: 'nuwan.j@example.com', phone: '0771234009', role: 'patient' },
    { fullName: 'Fathima Nuzha', email: 'fathima.n@example.com', phone: '0771234010', role: 'patient' },
    { fullName: 'Kevin Smith', email: 'kevin.s@example.com', phone: '0771234011', role: 'patient' },
    { fullName: 'Rashmika Mendis', email: 'rashmika.m@example.com', phone: '0771234012', role: 'patient' }
];

async function generateNextPatientId() {
    const prefix = 'P-';
    const regex = new RegExp(`^${prefix}\\d+$`);
    const users = await User.find({ patientId: { $regex: regex } }).select('patientId');
    let nextIdNum = 1001;
    if (users && users.length > 0) {
        const idNums = users.map(u => {
            const match = u.patientId.match(new RegExp(`${prefix}(\\d+)`));
            return match ? parseInt(match[1]) : 0;
        }).filter(n => !isNaN(n));
        if (idNums.length > 0) {
            nextIdNum = Math.max(...idNums) + 1;
        }
    }
    return `${prefix}${nextIdNum}`;
}

async function seedPatients() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const pd of patientsData) {
            const exists = await User.findOne({ email: pd.email });
            if (!exists) {
                const patientId = await generateNextPatientId();
                await User.create({
                    ...pd,
                    password: 'password123',
                    patientId,
                    age: Math.floor(Math.random() * 50) + 15
                });
                console.log(`Created Patient: ${pd.fullName} with ID ${patientId}`);
            } else {
                console.log(`Patient ${pd.fullName} already exists`);
            }
        }
        
        console.log('Finished seeding patients.');
        process.exit(0);
    } catch (e) {
        console.error('Error seeding patients:', e);
        process.exit(1);
    }
}

seedPatients();

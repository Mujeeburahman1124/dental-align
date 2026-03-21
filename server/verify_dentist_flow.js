
import mongoose from 'mongoose';
import User from './models/User.js';
import TreatmentRecord from './models/TreatmentRecord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const verifyAndCreate = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dental-align';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB...');

        // 1. List all Dentists
        const dentists = await User.find({ role: 'dentist' });
        console.log('\n--- CURRENT DENTISTS ---');
        dentists.forEach(d => console.log(`${d.fullName} (${d.email}) - ID: ${d._id}`));

        // 2. List all Patients
        const patients = await User.find({ role: 'patient' });
        console.log('\n--- CURRENT PATIENTS ---');
        patients.forEach(p => console.log(`${p.fullName} (ID: ${p._id}) (PatientID: ${p.patientId})`));

        // 3. Create a NEW Dentist if requested (or just use one if many exist)
        // The user wants "each and every dentist to log by their email".
        // Let's create a specific new dentist to test this isolation.
        const newDentistEmail = 'dr.james@dentalign.com';
        let newDentist = await User.findOne({ email: newDentistEmail });

        if (!newDentist) {
            console.log(`\nCreating new dentist: ${newDentistEmail}...`);
            newDentist = await User.create({
                fullName: 'Dr. James Wilson',
                email: newDentistEmail,
                phone: '0771122334',
                password: 'password123',
                role: 'dentist',
                slmcNumber: 'SLMC-8055',
                specialization: 'Oral Surgery'
            });
            console.log('New Dentist Created.');
        } else {
            console.log(`\nUsing existing dentist: ${newDentist.fullName}`);
        }

        // 4. Simulate this dentist adding a record to "Fathima"
        // Find Fathima
        const fathima = patients.find(p => p.fullName.toLowerCase().includes('fathima') || p._id.toString().endsWith('e4c5'));

        if (fathima) {
            console.log(`\nCreating record for ${fathima.fullName} by ${newDentist.fullName}...`);

            const record = await TreatmentRecord.create({
                patient: fathima._id,
                dentist: newDentist._id,
                title: 'Wisdom Tooth Consultation',
                procedures: ['X-Ray', 'Consultation'],
                notes: 'Lower right wisdom tooth impacted. Scheduled for extraction.',
                date: new Date(),
                cost: 2000,
                paid: false
            });
            console.log('Record created successfully:', record._id);

            // 5. Verify it is queryable by the patient
            const patientRecords = await TreatmentRecord.find({ patient: fathima._id });
            console.log(`\nTotal records for ${fathima.fullName}: ${patientRecords.length}`);
            patientRecords.forEach(r => {
                console.log(`- ${r.title} (Dr. ${r.dentist})`); // unlikely to populate here without populate() call but ID shows linkage
            });

        } else {
            console.log('Patient Fathima not found to test linkage.');
        }

        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyAndCreate();

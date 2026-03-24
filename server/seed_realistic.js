import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TreatmentRecord from './models/TreatmentRecord.js';
import User from './models/User.js';

dotenv.config({ path: '.env' });

const notesOptions = [
    "Patient presented with mild gingivitis. Performed thorough scaling and root planing. Advised to use chlorhexidine mouthwash twice daily for one week.",
    "Routine review of orthodontic brackets. Adjusted wire tension on upper arch. No signs of decalcification observed. Next adjustment in 4 weeks.",
    "Excavated deep carious lesion on tooth 46. Placed composite restoration. Monitored for pulpal sensitivity. Bite feels normal.",
    "Patient complained of sharp pain in lower left quadrant. Diagnosis: Irreversible pulpitis on tooth 36. Initiated first stage of root canal therapy.",
    "Post-operative check for wisdom tooth extraction. Healing progressing well. Sutures removed. Patient reports no excessive pain or bleeding.",
    "Complete oral prophylaxis performed. Subgingival calculus removed using ultrasonic scaler. Flouride varnish applied to all teeth.",
    "Preparation for porcelain crown on tooth 14. Impression taken and sent to lab. Temporary acrylic crown cemented. Shade A2 selected."
];

const titlesOptions = [
    "Scaling and Root Planing",
    "Orthodontic Adjustment",
    "Composite Restoration (Tooth 46)",
    "Root Canal Therapy - Session 1",
    "Post-Op Wisdom Tooth Check",
    "Oral Prophylaxis & Fluoride",
    "Crown Preparation (Tooth 14)"
];

const procArray = [
    ["Scaling", "Root Planing"],
    ["Wire Adjustment", "O-Ring Replacement"],
    ["Caries Removal", "Composite Filling"],
    ["Access cavity prep", "Extirpation of pulp"],
    ["Suture removal", "Irrigation"],
    ["Ultrasonic scaling", "Polishing", "Fluoride varnish"],
    ["Tooth preparation", "Impression", "Temporary crown"]
];

const prescriptionsOptions = [
    "Chlorhexidine Mouthwash 0.2%, Use BID",
    "None required",
    "None required",
    "Amoxicillin 500mg TDS for 5 days, Ibuprofen 400mg PRN",
    "Paracetamol 500mg SOS",
    "None required",
    "None required"
];

async function seedRealistic() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await TreatmentRecord.deleteMany();
        console.log('Cleared all previous identical treatment records.');

        const patients = await User.find({ role: 'patient' });
        const dentists = await User.find({ role: 'dentist' });
        
        let count = 0;

        for (const patient of patients) {
            // Assign 1 or 2 records
            const numRecords = Math.floor(Math.random() * 2) + 1;
            
            for(let i=0; i<numRecords; i++) {
                const randIndex = Math.floor(Math.random() * notesOptions.length);
                const assignedDentist = dentists[Math.floor(Math.random() * dentists.length)];
                
                await TreatmentRecord.create({
                    patient: patient._id,
                    dentist: assignedDentist._id,
                    title: titlesOptions[randIndex],
                    procedures: procArray[randIndex],
                    notes: notesOptions[randIndex],
                    prescriptions: prescriptionsOptions[randIndex],
                    cost: Math.floor(Math.random() * 10000) + 2000,
                    paid: Math.random() > 0.3,
                    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000)
                });
                count++;
            }
        }

        console.log(`Successfully generated ${count} highly realistic treatment records across ${patients.length} patients.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seedRealistic();

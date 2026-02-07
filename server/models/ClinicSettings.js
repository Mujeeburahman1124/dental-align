import mongoose from 'mongoose';

const clinicSettingsSchema = mongoose.Schema({
    timeSlots: {
        type: [String],
        required: true,
        default: [
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
        ]
    },
    workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    holidays: {
        type: [Date],
        default: []
    }
}, { timestamps: true });

const ClinicSettings = mongoose.model('ClinicSettings', clinicSettingsSchema);
export default ClinicSettings;

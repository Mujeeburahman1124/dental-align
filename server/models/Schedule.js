import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    dentistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    startTime: {
        type: String, // e.g., "09:00"
        required: true
    },
    endTime: {
        type: String, // e.g., "17:00"
        required: true
    },
    lunchStartTime: {
        type: String, // e.g., "12:00"
        default: "12:00"
    },
    lunchEndTime: {
        type: String, // e.g., "13:00"
        default: "13:00"
    },
    isGovHospitalDay: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);

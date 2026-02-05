import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dentist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // e.g., "09:30 AM"
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    },
    serviceName: {
        type: String
    },
    estimatedCost: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bookingFee: {
        type: Number,
        default: 500 // Standard booking/consultation fee
    },
    isFeePaid: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Appointment', appointmentSchema);

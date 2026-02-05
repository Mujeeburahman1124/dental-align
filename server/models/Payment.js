import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    treatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TreatmentRecord'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['booking_fee', 'treatment_fee', 'deposit'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'bank_transfer'],
        default: 'card'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    transactionId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema);

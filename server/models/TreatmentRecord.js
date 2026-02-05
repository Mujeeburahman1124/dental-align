import mongoose from 'mongoose';

const treatmentRecordSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    procedures: [{
        type: String
    }],
    notes: {
        type: String
    },
    prescriptions: {
        type: String // Storing as simple string/text for now as per UI
    },
    attachments: [{
        name: String,
        url: String,
        type: { type: String, enum: ['xray', 'photo', 'document'] }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    cost: {
        type: Number,
        default: 0
    },
    paid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('TreatmentRecord', treatmentRecordSchema);

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['appointment', 'payment', 'system', 'treatment'],
        default: 'system'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId // Reference to appointment or treatment if needed
    }
}, {
    timestamps: true
});

export default mongoose.model('Notification', notificationSchema);

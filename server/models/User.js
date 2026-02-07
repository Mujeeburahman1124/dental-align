import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allow nulls for patients without email
        trim: true,
        lowercase: true
    },
    patientId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'dentist', 'staff', 'admin'],
        default: 'patient'
    },
    // Dentist Specific Fields
    slmcNumber: {
        type: String,
        required: function () { return this.role === 'dentist'; }
    },
    specialization: {
        type: String,
        required: function () { return this.role === 'dentist'; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw new Error(err);
    }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

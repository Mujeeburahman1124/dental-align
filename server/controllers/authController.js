import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role, slmcNumber, specialization } = req.body;

        // Check if user exists (only if email is provided)
        if (email) {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }
        }

        // Validate Dentist fields
        if (role === 'dentist' && (!slmcNumber || !specialization)) {
            return res.status(400).json({ message: 'Dentists must provide SLMC Number and Specialization' });
        }

        // Generate Patient ID if role is patient
        let patientId = undefined;
        if (!role || role === 'patient') {
            // Find the last created patient WHO HAS a patientId
            const lastPatient = await User.findOne({
                role: 'patient',
                patientId: { $exists: true, $ne: null }
            }).sort({ createdAt: -1 });

            if (lastPatient && lastPatient.patientId) {
                const lastIdNum = parseInt(lastPatient.patientId.split('-')[1]);
                patientId = `P-${lastIdNum + 1}`;
            } else {
                patientId = 'P-1001';
            }
        }

        // Create user
        const user = await User.create({
            fullName,
            email: email || undefined, // Allow sparse unique index to work
            phone,
            password,
            role: role || 'patient',
            patientId,
            slmcNumber: role === 'dentist' ? slmcNumber : undefined,
            specialization: role === 'dentist' ? specialization : undefined,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                patientId: user.patientId,
                email: user.email,
                role: user.role,
                slmcNumber: user.slmcNumber,
                specialization: user.specialization,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, patientId, password } = req.body;

        let user;

        // Login by Email (Staff/Admin/Dentist or Patient with email)
        if (email) {
            user = await User.findOne({ email });
        }
        // Login by Patient ID
        else if (patientId) {
            user = await User.findOne({ patientId: patientId.toUpperCase() });
        }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                patientId: user.patientId,
                email: user.email,
                role: user.role,
                slmcNumber: user.slmcNumber,
                specialization: user.specialization,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

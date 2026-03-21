import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import admin from '../config/firebase.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// Generate Unique ID based on role
const generateUniqueId = async (role) => {
    let prefix = 'P-'; // Default for patient/guest
    if (role === 'dentist') prefix = 'D-';
    if (role === 'staff') prefix = 'S-';
    if (role === 'admin') prefix = 'A-';

    const regex = new RegExp(`^${prefix}\\d+$`);
    const users = await User.find({ patientId: { $regex: regex } }).select('patientId');

    let nextIdNum = 1001;
    if (users && users.length > 0) {
        const idNums = users
            .map(u => {
                const match = u.patientId.match(new RegExp(`${prefix}(\\d+)`));
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));

        if (idNums.length > 0) {
            nextIdNum = Math.max(...idNums) + 1;
        }
    }

    let patientId = `${prefix}${nextIdNum}`;

    // Double check loop for high concurrency safety
    let idExists = await User.findOne({ patientId });
    while (idExists) {
        nextIdNum++;
        patientId = `${prefix}${nextIdNum}`;
        idExists = await User.findOne({ patientId });
    }

    return patientId;
};

// @desc    Google Login/Register
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'No ID token provided' });
        }

        // Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture, uid } = decodedToken;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new GUEST user (Google Login = Guest Access)
            const patientId = await generateUniqueId('guest');
            user = await User.create({
                fullName: name,
                email: email,
                password: Math.random().toString(36).slice(-8), // Dummy password
                role: 'guest',
                patientId,
                phone: 'Not provided'
            });
        }

        res.json({
            _id: user._id,
            fullName: user.fullName,
            patientId: user.patientId,
            email: user.email,
            role: user.role,
            medicalHistory: user.medicalHistory,
            allergies: user.allergies,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
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

<<<<<<< HEAD
        // Generate Unique ID
        const patientId = await generateUniqueId(role || 'patient');
=======
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
>>>>>>> 62be0195fba92df2a013b37f7abfabafa0405c62

        // Create user
        const user = await User.create({
            fullName,
            email: email ? email.toLowerCase().trim() : undefined, // Ensure undefined for sparse unique index
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
                phone: user.phone,
                age: user.age,
                role: user.role,
                medicalHistory: user.medicalHistory,
                allergies: user.allergies,
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

        // basic validation to avoid unexpected missing fields causing errors
        if ((!email || email === '') && (!patientId || patientId === '')) {
            return res.status(400).json({ message: 'Please provide email or patient ID' });
        }
        if (!password || password === '') {
            return res.status(400).json({ message: 'Password is required' });
        }

        let user;

        // Login by Email (Staff/Admin/Dentist or Patient with email)
        if (email) {
            user = await User.findOne({ email: email.toLowerCase().trim() });
        }
        // Login by Patient ID
        else if (patientId) {
            user = await User.findOne({ patientId: patientId.toUpperCase().trim() });
        }

        if (user && (await user.matchPassword(password))) {
            // Optional: Role verification if provided by frontend
            const intendedRole = req.body.role;
            if (intendedRole && intendedRole.toLowerCase() !== user.role.toLowerCase()) {
                // Special case: Admin can login as any role they have access to? 
                // No, for simplicity and security, role must match.
                return res.status(401).json({ message: `Access denied: This account is registered as a ${user.role}, not a ${intendedRole}.` });
            }
            res.json({
                _id: user._id,
                fullName: user.fullName,
                patientId: user.patientId,
                email: user.email,
                phone: user.phone,
                age: user.age,
                role: user.role,
                medicalHistory: user.medicalHistory,
                allergies: user.allergies,
                slmcNumber: user.slmcNumber,
                specialization: user.specialization,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('loginUser error:', error, 'request body:', req.body);
        res.status(500).json({ message: 'Server Error' });
    }
};

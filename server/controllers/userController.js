import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all users with role 'dentist'
// @route   GET /api/users/dentists
// @access  Public
export const getDentists = async (req, res) => {
    try {
        const dentists = await User.find({ role: 'dentist' })
            .select('-password')
            .sort({ fullName: 1 });
        res.json(dentists);
    } catch (error) {
        console.error('Get Dentists Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users with role 'patient'
// @route   GET /api/users/patients
// @access  Private (Dentist/Admin)
export const getPatients = async (req, res) => {
    try {
        // Can filter by name if query param exists
        const keyword = req.query.search
            ? {
                $or: [
                    { fullName: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                ],
            }
            : {};

        const patients = await User.find({ 
            ...keyword, 
            role: { $in: ['patient', 'guest'] } 
        })
            .select('-password')
            .sort({ fullName: 1 })
            .lean();

        // Attach last visit date for each patient
        const patientsWithLastVisit = await Promise.all(patients.map(async (patient) => {
            const lastAppt = await Appointment.findOne({
                patient: patient._id,
                status: 'completed'
            }).sort({ date: -1 });

            return {
                ...patient,
                lastVisit: lastAppt ? lastAppt.date : null
            };
        }));

        res.json(patientsWithLastVisit);
    } catch (error) {
        console.error('Get Patients Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) === 1) {
                return res.status(400).json({ message: 'Cannot delete the only administrator' });
            }
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.age = req.body.age || user.age;
            user.medicalHistory = req.body.medicalHistory || user.medicalHistory;
            user.allergies = req.body.allergies || user.allergies;

            if (req.body.password) {
                user.password = req.body.password;
            }

            // Update Dentist specific fields
            if (user.role === 'dentist') {
                user.slmcNumber = req.body.slmcNumber || user.slmcNumber;
                user.specialization = req.body.specialization || user.specialization;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                age: updatedUser.age,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                medicalHistory: updatedUser.medicalHistory,
                allergies: updatedUser.allergies,
                slmcNumber: updatedUser.slmcNumber,
                specialization: updatedUser.specialization,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            age: user.age,
            role: user.role,
            patientId: user.patientId,
            medicalHistory: user.medicalHistory,
            allergies: user.allergies,
            slmcNumber: user.slmcNumber,
            specialization: user.specialization
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
// @desc    Update patient profile by Staff/Admin
// @route   PUT /api/users/:id
// @access  Private/Staff
export const updatePatientByStaff = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.age = req.body.age || user.age;
            user.medicalHistory = req.body.medicalHistory || user.medicalHistory;
            user.blocked = req.body.blocked !== undefined ? req.body.blocked : user.blocked;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                age: updatedUser.age,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                blocked: updatedUser.blocked
            });
        } else {
            res.status(404).json({ message: 'Patient document not found' });
        }
    } catch (error) {
        console.error('Staff Update Error:', error);
        res.status(500).json({ message: 'Server Protocol Error' });
    }
};

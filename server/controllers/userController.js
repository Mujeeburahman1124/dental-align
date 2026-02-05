import User from '../models/User.js';

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

        const patients = await User.find({ ...keyword, role: 'patient' })
            .select('-password') // Exclude password
            .sort({ fullName: 1 });

        res.json(patients);
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

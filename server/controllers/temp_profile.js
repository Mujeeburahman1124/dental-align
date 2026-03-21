
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
            // Add other fields if necessary
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

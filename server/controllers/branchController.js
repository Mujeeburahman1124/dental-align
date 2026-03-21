import Branch from '../models/Branch.js';

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find({});
        res.json(branches);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a branch
// @route   POST /api/branches
// @access  Private (Admin)
export const createBranch = async (req, res) => {
    try {
        const { name, location, contactNumber } = req.body;
        const branch = await Branch.create({ name, location, contactNumber });
        res.status(201).json(branch);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

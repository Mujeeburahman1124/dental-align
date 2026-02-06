import TreatmentRecord from '../models/TreatmentRecord.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new treatment record
// @route   POST /api/treatments
// @access  Private (Dentist)
export const createTreatment = async (req, res) => {
    try {
        const { patientId, title, procedures, notes, prescriptions, cost, paid } = req.body;

        if (!patientId || !title) {
            return res.status(400).json({ message: 'Patient and Title are required' });
        }

        // Split procedures string into array if it came as string from UI
        // UI sends "procedures" as string 'Proc1, Proc2' usually
        let proceduresArray = [];
        if (typeof procedures === 'string') {
            proceduresArray = procedures.split(',').map(p => p.trim()).filter(p => p !== '');
        } else if (Array.isArray(procedures)) {
            proceduresArray = procedures;
        }

        const treatment = await TreatmentRecord.create({
            patient: patientId,
            dentist: req.user._id,
            title,
            procedures: proceduresArray,
            notes,
            prescriptions, // keeping as string
            cost: cost || 0,
            paid: paid || false,
            date: new Date()
        });

        // Trigger notification
        await createNotification(
            patientId,
            'treatment',
            `A new treatment record for ${title} has been added to your profile by Dr. ${req.user.fullName}.`,
            treatment._id
        );

        res.status(201).json(treatment);
    } catch (error) {
        console.error('Create Treatment Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all treatments for a specific patient
// @route   GET /api/treatments/patient/:patientId
// @access  Private (Dentist/Admin/Patient themselves)
export const getPatientTreatments = async (req, res) => {
    try {
        const { patientId } = req.params;

        const treatments = await TreatmentRecord.find({ patient: patientId })
            .populate('dentist', 'fullName')
            .sort({ date: -1 });

        res.json(treatments);
    } catch (error) {
        console.error('Get Treatments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get all treatments for the logged-in patient
// @route   GET /api/treatments/my-treatments
// @access  Private (Patient)
export const getMyTreatments = async (req, res) => {
    try {
        const treatments = await TreatmentRecord.find({ patient: req.user._id })
            .populate('dentist', 'fullName')
            .sort({ date: -1 });

        res.json(treatments);
    } catch (error) {
        console.error('Get My Treatments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get treatment summary (Total cost, outstanding balance)
// @route   GET /api/treatments/summary
// @access  Private (Patient)
export const getTreatmentSummary = async (req, res) => {
    try {
        const treatments = await TreatmentRecord.find({ patient: req.user._id });

        const totalSpent = treatments.reduce((acc, curr) => acc + (curr.cost || 0), 0);
        const outstanding = treatments
            .filter(t => !t.paid)
            .reduce((acc, curr) => acc + (curr.cost || 0), 0);

        res.json({
            totalSpent,
            outstanding,
            count: treatments.length
        });
    } catch (error) {
        console.error('Summary Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all clinic treatments (Admin/Staff)
// @route   GET /api/treatments/all
// @access  Private (Admin/Staff)
export const getAllTreatments = async (req, res) => {
    try {
        const treatments = await TreatmentRecord.find({})
            .populate('patient', 'fullName email')
            .populate('dentist', 'fullName')
            .sort({ date: -1 });

        res.json(treatments);
    } catch (error) {
        console.error('Get All Treatments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

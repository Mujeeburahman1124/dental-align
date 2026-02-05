import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = async (req, res) => {
    try {
        const { dentistId, date, time, reason, serviceName, estimatedCost } = req.body;

        // Basic validation
        if (!dentistId || !date || !time || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Verify dentist exists
        const dentist = await User.findById(dentistId);
        if (!dentist || dentist.role !== 'dentist') {
            return res.status(400).json({ message: 'Invalid dentist selected' });
        }

        // Check for double booking
        const existingAppointment = await Appointment.findOne({
            dentist: dentistId,
            date: new Date(date),
            time: time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: 'This time slot is already booked for this dentist. Please choose another time.'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: req.user.id,
            dentist: dentistId,
            date,
            time,
            reason,
            serviceName,
            estimatedCost: estimatedCost || 0
        });

        // Trigger notification
        await createNotification(
            req.user.id,
            'appointment',
            `Your appointment for ${reason} with Dr. ${dentist.fullName} has been scheduled for ${new Date(date).toLocaleDateString()} at ${time}.`,
            appointment._id
        );

        res.status(201).json(appointment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patient: req.user.id })
                .populate('dentist', 'fullName specialization')
                .sort({ date: 1 }); // Sort by date ascending
        } else if (req.user.role === 'dentist') {
            appointments = await Appointment.find({ dentist: req.user.id })
                .populate('patient', 'fullName phone')
                .sort({ date: 1 });
        } else {
            // Admin sees all? or restricted? Let's just return empty for others for now
            appointments = [];
        }

        res.json(appointments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get appointments for a specific patient (for Dentist/Admin)
// @route   GET /api/appointments/patient/:patientId
// @access  Private (Dentist/Admin)
export const getPatientAppointments = async (req, res) => {
    try {
        const { patientId } = req.params;
        const appointments = await Appointment.find({ patient: patientId })
            .populate('dentist', 'fullName specialization')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get booked slots for a dentist on a specific date
// @route   GET /api/appointments/booked-slots
// @access  Private
export const getBookedSlots = async (req, res) => {
    try {
        const { dentistId, date } = req.query;
        if (!dentistId || !date) {
            return res.status(400).json({ message: 'Dentist ID and Date are required' });
        }

        const appointments = await Appointment.find({
            dentist: dentistId,
            date: new Date(date),
            status: { $ne: 'cancelled' }
        }).select('time');

        const bookedTimes = appointments.map(appt => appt.time);
        res.json(bookedTimes);
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

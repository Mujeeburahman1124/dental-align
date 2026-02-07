import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { createNotification, sendSMS } from './notificationController.js';

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

// @desc    Book appointment for walk-in patient (Staff only)
// @route   POST /api/appointments/walk-in
// @access  Private (Staff/Admin)
export const createWalkInAppointment = async (req, res) => {
    try {
        const { patientName, patientEmail, patientPhone, date, time, reason, dentist, notes, sendEmail } = req.body;

        // Validate required fields (Email is optional)
        if (!patientName || !patientPhone || !date || !time || !reason) {
            return res.status(400).json({ message: 'Please provide required details (Name, Phone, Date, Time, Service)' });
        }

        // Check if patient exists by phone (primary) or email
        let patient = await User.findOne({ phone: patientPhone });

        if (!patient && patientEmail) {
            patient = await User.findOne({ email: patientEmail });
        }

        // If patient doesn't exist, create a basic patient record
        if (!patient) {
            // Generate Patient ID
            const count = await User.countDocuments({ role: 'patient' });
            const patientId = `P-${1001 + count}`;

            patient = await User.create({
                fullName: patientName,
                email: patientEmail || undefined,
                phone: patientPhone,
                patientId,
                password: Math.random().toString(36).slice(-8), // Random temp password
                role: 'patient'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            dentist: dentist || null,
            date,
            time,
            reason,
            serviceName: reason,
            estimatedCost: 0,
            status: 'confirmed', // Auto-confirm staff bookings
            notes: notes || '',
            isFeePaid: false
        });

        // Populate patient and dentist info
        await appointment.populate('patient', 'fullName email phone patientId');
        if (dentist) {
            await appointment.populate('dentist', 'fullName specialization');
        }

        // Send SMS notification
        if (sendEmail && patientPhone) {
            const message = `DentAlign: Appointment confirmed for ${reason} on ${new Date(date).toLocaleDateString()} at ${time}.`;
            // Simulate SMS sending
            await sendSMS(patientPhone, message);
        }

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment,
            emailSent: sendEmail ? true : false
        });

    } catch (error) {
        console.error('Walk-in booking error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Book appointment for public/guest patient
// @route   POST /api/appointments/public
// @access  Public
export const createPublicAppointment = async (req, res) => {
    try {
        const { patientName, patientEmail, patientPhone, date, time, reason, dentist, notes } = req.body;

        // Validate required fields (Email is optional)
        if (!patientName || !patientPhone || !date || !time || !reason) {
            return res.status(400).json({ message: 'Please provide required details (Name, Phone, Date, Time, Service)' });
        }

        // Check if patient exists by phone (primary) or email
        let patient = await User.findOne({ phone: patientPhone });

        if (!patient && patientEmail) {
            patient = await User.findOne({ email: patientEmail });
        }

        // If patient doesn't exist, create a basic patient record
        if (!patient) {
            // Generate Patient ID
            const count = await User.countDocuments({ role: 'patient' });
            const patientId = `P-${1001 + count}`;

            patient = await User.create({
                fullName: patientName,
                email: patientEmail || undefined,
                phone: patientPhone,
                patientId,
                password: Math.random().toString(36).slice(-8), // Random temp password
                role: 'patient'
            });
        }

        // Verify dentist exists if provided
        let dentistObj = null;
        if (dentist) {
            dentistObj = await User.findById(dentist);
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            dentist: dentist || null,
            date,
            time,
            reason,
            serviceName: reason,
            estimatedCost: 0,
            status: 'pending', // Online bookings are pending by default
            notes: notes || '',
            isFeePaid: false
        });

        // Populate patient info for response
        await appointment.populate('patient', 'fullName email phone patientId');
        if (dentist) {
            await appointment.populate('dentist', 'fullName specialization');
        }

        // Trigger notification
        const msgText = `Your appointment request for ${reason} on ${new Date(date).toLocaleDateString()} at ${time} has been received.`;
        await createNotification(
            patient._id,
            'appointment',
            msgText,
            appointment._id
        );

        // Send confirmation SMS
        if (patientPhone) {
            await sendSMS(patientPhone, `DentAlign: ${msgText}`);
        }

        res.status(201).json({
            message: 'Appointment request sent successfully',
            appointment
        });

    } catch (error) {
        console.error('Public booking error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
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
        } else if (req.user.role === 'staff' || req.user.role === 'admin') {
            // Staff and Admin can see all appointments
            appointments = await Appointment.find({})
                .populate('patient', 'fullName phone email')
                .populate('dentist', 'fullName specialization')
                .sort({ date: 1 });
        } else {
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

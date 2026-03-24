import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Schedule from '../models/Schedule.js';
import Branch from '../models/Branch.js';
import { createNotification, sendSMS, sendEmail } from './notificationController.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = async (req, res) => {
    try {
        const { dentistId, branchId, date, time, reason, serviceName, estimatedCost, patientAge } = req.body;

        // Basic validation
        if (!dentistId || !branchId || !date || !time || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields (Dentist, Branch, Date, Time, Reason)' });
        }

        // Update patient age if provided
        if (patientAge) {
            await User.findByIdAndUpdate(req.user.id, { age: patientAge });
        }

        // Verify dentist exists
        const dentist = await User.findById(dentistId);
        if (!dentist || dentist.role !== 'dentist') {
            return res.status(400).json({ message: 'Invalid dentist selected' });
        }

        // Check for double booking (only hard constraint)
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

        // Get branch: use provided or default to first
        let finalBranchId = branchId;
        if (!finalBranchId) {
            const allBranches = await Branch.find({});
            finalBranchId = allBranches[0]?._id;
        }
        if (!finalBranchId) {
            return res.status(400).json({ message: 'No clinical branches configured. Contact admin.' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: req.user.id,
            dentist: dentistId,
            branch: finalBranchId,
            date,
            time,
            reason,
            serviceName,
            estimatedCost: estimatedCost || 0
        });

        await appointment.populate('patient', 'fullName email phone patientId');
        await appointment.populate('dentist', 'fullName specialization');
        await appointment.populate('branch', 'name');

        // Resolve branch name for notification
        const branch = await Branch.findById(branchId);
        const branchName = branch ? branch.name : 'Main Clinic';
        const docName = dentist.fullName.toLowerCase().startsWith('dr') ? dentist.fullName : `Dr. ${dentist.fullName}`;

        // Trigger notification
        await createNotification(
            req.user.id,
            'appointment',
            `Your appointment for ${reason} with ${docName} at branch ${branchName} has been scheduled for ${new Date(date).toLocaleDateString()} at ${time}.`,
            appointment._id
        );

        // Send Email Confirmation
        await sendEmail(
            req.user.email,
            'Booking Confirmation - Dental Align',
            `Hello ${req.user.fullName},\n\nYour appointment for ${reason} with ${docName} at ${branchName} has been successfully scheduled.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\n\nWe look forward to seeing you!\n\nDental Align Clinic`
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
        const { patientName, patientAge, patientEmail, patientPhone, date, time, reason, dentist, notes, sendEmail } = req.body;

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
            // Generate Patient ID
            const lastPatient = await User.findOne({
                role: 'patient',
                patientId: { $exists: true, $ne: null }
            }).sort({ createdAt: -1 });

            let patientId = 'P-1001';
            if (lastPatient && lastPatient.patientId) {
                const lastIdNum = parseInt(lastPatient.patientId.split('-')[1]);
                patientId = `P-${lastIdNum + 1}`;
            }

            patient = await User.create({
                fullName: patientName,
                age: patientAge,
                email: patientEmail || undefined,
                phone: patientPhone,
                patientId,
                password: Math.random().toString(36).slice(-8), // Random temp password
                role: 'patient'
            });
        }

        // Get default branch if none provided
        const allBranches = await Branch.find({});
        const branchId = allBranches[0]?._id;

        if (!branchId) {
            return res.status(400).json({ message: 'No clinical branches found in database. Contact admin.' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            dentist: dentist || null,
            branch: branchId,
            date,
            time,
            reason,
            serviceName: reason,
            estimatedCost: 0,
            status: 'confirmed', // Auto-confirm staff bookings
            notes: notes || '',
            isFeePaid: false
        });

        // Populate patient, dentist and branch info
        await appointment.populate('patient', 'fullName email phone patientId');
        if (dentist) {
            await appointment.populate('dentist', 'fullName specialization');
        }
        await appointment.populate('branch', 'name');

        // Send SMS notification
        if (sendEmail && patientPhone) {
            const message = `DentAlign: Appointment confirmed for ${reason} on ${new Date(date).toLocaleDateString()} at ${time}.`;
            // Simulate SMS sending
            await sendSMS(patientPhone, message);
        }

        // Send Email Confirmation if requested and email exists
        if (sendEmail && patientEmail) {
            await sendEmail(
                patientEmail,
                'Booking Confirmation - Dental Align',
                `Hello ${patientName},\n\nYour appointment for ${reason} has been successfully scheduled at Dental Align.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\n\nWe look forward to seeing you!\n\nDental Align Clinic`
            );
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
        const { patientName, patientAge, patientEmail, patientPhone, date, time, reason, dentist, notes } = req.body;

        // Validate required fields (Email is optional)
        if (!patientName || !patientAge || !patientPhone || !date || !time || !reason) {
            return res.status(400).json({ message: 'Please provide required details (Name, Age, Phone, Date, Time, Service)' });
        }

        // Check if patient exists by phone (primary) or email
        let patient = await User.findOne({ phone: patientPhone });

        if (!patient && patientEmail) {
            patient = await User.findOne({ email: patientEmail });
        }

        // If patient doesn't exist, create a basic patient record
        if (!patient) {
            // Generate Patient ID
            // Generate Patient ID
            const lastPatient = await User.findOne({
                role: 'patient',
                patientId: { $exists: true, $ne: null }
            }).sort({ createdAt: -1 });

            let patientId = 'P-1001';
            if (lastPatient && lastPatient.patientId) {
                const lastIdNum = parseInt(lastPatient.patientId.split('-')[1]);
                patientId = `P-${lastIdNum + 1}`;
            }

            patient = await User.create({
                fullName: patientName,
                age: patientAge,
                email: patientEmail || undefined,
                phone: patientPhone,
                patientId,
                password: Math.random().toString(36).slice(-8), // Random temp password
                role: 'patient'
            });
        } else {
            // Update age if patient exists but provides it now
            if (patientAge && (!patient.age || patient.age !== patientAge)) {
                patient.age = patientAge;
                await patient.save();
            }
        }

        // Verify dentist exists if provided
        let dentistObj = null;
        if (dentist) {
            dentistObj = await User.findById(dentist);
        }

        // Get branch from request or default to first one
        let finalBranchId = req.body.branchId || req.body.branch;
        if (!finalBranchId) {
            const allBranches = await Branch.find({});
            finalBranchId = allBranches[0]?._id;
        }

        if (!finalBranchId) {
            return res.status(400).json({ message: 'No clinical branches found in database. Contact admin.' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            dentist: dentist || null,
            branch: finalBranchId,
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
        await appointment.populate('branch', 'name');

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

        // Send Email Confirmation if email exists
        if (patientEmail) {
            await sendEmail(
                patientEmail,
                'Public Booking Confirmation - Dental Align',
                `Hello ${patientName},\n\nYour public appointment for ${reason} has been successfully requested at Dental Align.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\n\nOur team will contact you if any changes are needed.\n\nDental Align Clinic`
            );
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
                .populate('branch', 'name')
                .sort({ date: 1 }); // Sort by date ascending
        } else if (req.user.role === 'dentist') {
            appointments = await Appointment.find({ dentist: req.user.id })
                .populate('patient', 'fullName phone email patientId')
                .populate('branch', 'name')
                .sort({ date: 1 });
        } else if (req.user.role === 'staff' || req.user.role === 'admin') {
            // Staff and Admin can see all appointments
            appointments = await Appointment.find({})
                .populate('patient', 'fullName phone email')
                .populate('dentist', 'fullName specialization')
                .populate('branch', 'name')
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
            .populate('branch', 'name')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get appointments for a specific dentist
// @route   GET /api/appointments/dentist/:dentistId
// @access  Private (Dentist/Staff/Admin)
export const getDentistAppointments = async (req, res) => {
    try {
        const { dentistId } = req.params;
        const appointments = await Appointment.find({ dentist: dentistId })
            .populate('patient', 'fullName phone email patientId')
            .populate('branch', 'name')
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching dentist appointments:', error);
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

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = req.body.status || appointment.status;
        const updated = await appointment.save();
        res.json(updated);
    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Book appointment for existing patient (Staff only)
// @route   POST /api/appointments/staff
// @access  Private (Staff/Admin)
export const createStaffAppointment = async (req, res) => {
    try {
        const { patientId, date, time, reason, dentistId, branchId, notes, patientAge } = req.body;

        // Validate required fields
        if (!patientId || !date || !time || !reason) {
            return res.status(400).json({ message: 'Please provide patient, date, time, and service.' });
        }

        // Verify patient exists
        const patient = await User.findById(patientId);
        if (!patient || (patient.role !== 'patient' && patient.role !== 'guest')) {
            return res.status(400).json({ message: 'Invalid patient selected.' });
        }

        // Update age if provided
        if (patientAge && patientAge !== patient.age) {
            patient.age = patientAge;
            await patient.save();
        }

        // Get default branch if none provided
        let finalBranchId = branchId;
        if (!finalBranchId) {
            const allBranches = await Branch.find({});
            finalBranchId = allBranches[0]?._id;
        }

        if (!finalBranchId) {
            return res.status(400).json({ message: 'No clinical branches found in database. Contact admin.' });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: patientId,
            dentist: dentistId || null,
            branch: finalBranchId,
            date,
            time,
            reason,
            serviceName: reason,
            estimatedCost: 0,
            status: 'confirmed', // Staff bookings are confirmed by default
            notes: notes || '',
            isFeePaid: false
        });

        await appointment.populate('patient', 'fullName email phone patientId');
        if (dentistId) {
            await appointment.populate('dentist', 'fullName specialization');
        }
        await appointment.populate('branch', 'name');

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });

    } catch (error) {
        console.error('Staff booking error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update appointment fields (status, notes, reschedule) by ID
// @route   PUT /api/appointments/:id
// @access  Private (Staff/Dentist/Admin)
export const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        if (req.body.status !== undefined) appointment.status = req.body.status;
        if (req.body.notes !== undefined) appointment.notes = req.body.notes;
        if (req.body.time !== undefined) appointment.time = req.body.time;
        if (req.body.date !== undefined) appointment.date = req.body.date;
        if (req.body.isFeePaid !== undefined) appointment.isFeePaid = req.body.isFeePaid;

        const updated = await appointment.save();
        await updated.populate('patient', 'fullName phone email patientId');
        await updated.populate('dentist', 'fullName specialization');
        await updated.populate('branch', 'name');
        res.json(updated);
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

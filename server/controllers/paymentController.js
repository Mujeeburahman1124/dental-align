import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import TreatmentRecord from '../models/TreatmentRecord.js';
import { createNotification } from './notificationController.js';

// @desc    Process a new payment
// @route   POST /api/payments
// @access  Private (Patient)
export const processPayment = async (req, res) => {
    try {
        const { appointmentId, treatmentId, amount, paymentType, paymentMethod } = req.body;

        if (!amount || !paymentType) {
            return res.status(400).json({ message: 'Amount and Payment Type are required' });
        }

        // Create transaction record
        const payment = await Payment.create({
            patient: req.user._id,
            appointment: appointmentId,
            treatment: treatmentId,
            amount,
            paymentType,
            paymentMethod: paymentMethod || 'card',
            status: 'completed',
            transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        });

        // Update corresponding records
        if (paymentType === 'booking_fee' && appointmentId) {
            await Appointment.findByIdAndUpdate(appointmentId, { isFeePaid: true });
        } else if (paymentType === 'treatment_fee' && treatmentId) {
            await TreatmentRecord.findByIdAndUpdate(treatmentId, { paid: true });
        }

        // Trigger notification
        await createNotification(
            req.user._id,
            'payment',
            `Payment of Rs. ${amount.toLocaleString()} for ${paymentType === 'booking_fee' ? 'Booking Fee' : 'Treatment Settlement'} was successful. Transaction ID: ${payment.transactionId}`,
            payment._id
        );

        res.status(201).json(payment);
    } catch (error) {
        console.error('Payment Processing Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get patient payment history
// @route   GET /api/payments/my-payments
// @access  Private (Patient)
export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ patient: req.user._id })
            .populate('appointment', 'date time reason')
            .populate('treatment', 'title date cost')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        console.error('Fetch Payments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get billing summary for patient dashboard
// @route   GET /api/payments/summary
// @access  Private (Patient)
export const getBillingSummary = async (req, res) => {
    try {
        // Unpaid booking fees from pending appointments
        const pendingAppointments = await Appointment.find({
            patient: req.user._id,
            isFeePaid: false,
            status: { $ne: 'cancelled' }
        });

        // Unpaid treatment costs
        const pendingTreatments = await TreatmentRecord.find({
            patient: req.user._id,
            paid: false
        });

        const totalBookingFees = pendingAppointments.reduce((acc, curr) => acc + (curr.bookingFee || 500), 0);
        const totalEstimatedServices = pendingAppointments.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);
        const totalTreatmentCosts = pendingTreatments.reduce((acc, curr) => acc + (curr.cost || 0), 0);

        // Calculate total spent from successful payments
        const successfulPayments = await Payment.find({ patient: req.user._id, status: 'completed' });
        const totalSpent = successfulPayments.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            outstandingBalance: totalBookingFees + totalTreatmentCosts,
            bookingFeesDue: totalBookingFees,
            estimatedServicesDue: totalEstimatedServices,
            treatmentCostsDue: totalTreatmentCosts,
            unpaidCount: pendingAppointments.length + pendingTreatments.length,
            totalSpent
        });
    } catch (error) {
        console.error('Billing Summary Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all payments (clinic view)
// @route   GET /api/payments/all
// @access  Private (Admin/Staff)
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate('patient', 'fullName email')
            .populate('appointment', 'date time reason')
            .populate('treatment', 'title date cost')
            .sort({ date: -1 });

        res.json(payments);
    } catch (error) {
        console.error('Fetch All Payments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

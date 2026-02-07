import express from 'express';
import { createAppointment, createWalkInAppointment, getMyAppointments, getPatientAppointments, getBookedSlots, createPublicAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAppointment);
router.post('/public', createPublicAppointment);
router.post('/walk-in', protect, createWalkInAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/booked-slots', protect, getBookedSlots);
router.get('/patient/:patientId', protect, getPatientAppointments);

export default router;

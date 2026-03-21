import express from 'express';
import { createAppointment, createWalkInAppointment, createStaffAppointment, getMyAppointments, getPatientAppointments, getBookedSlots, createPublicAppointment, getDentistAppointments, updateAppointmentStatus, updateAppointment } from '../controllers/appointmentController.js';
import { protect, admin, dentist, staff, dentistOrStaff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAppointment); // Logic inside handles patient check
router.post('/public', createPublicAppointment);
router.post('/walk-in', protect, staff, createWalkInAppointment);
router.post('/staff', protect, staff, createStaffAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/dentist/:dentistId', protect, dentistOrStaff, getDentistAppointments); // Allow staff/dentists to see dentist schedules
router.get('/booked-slots', getBookedSlots); // Public for BookingPage
router.get('/patient/:patientId', protect, dentistOrStaff, getPatientAppointments); // Restrict to Staff/Dentist
router.put('/:id/status', protect, dentistOrStaff, updateAppointmentStatus); // Restrict to Staff/Dentist
router.put('/:id', protect, dentistOrStaff, updateAppointment); // General update (status, reschedule)

export default router;



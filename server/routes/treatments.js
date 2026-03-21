import express from 'express';
import { createTreatment, getPatientTreatments, getTreatmentSummary, getMyTreatments, getAllTreatments, markTreatmentPaid, getDentistTreatments } from '../controllers/treatmentController.js';
import { protect, dentistOrStaff, staff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, dentistOrStaff, createTreatment);
router.get('/summary', protect, getTreatmentSummary);
router.get('/my-treatments', protect, getMyTreatments);
router.get('/all', protect, staff, getAllTreatments); // Admin/Staff only
router.get('/dentist/:dentistId', protect, dentistOrStaff, getDentistTreatments);
router.get('/patient/:patientId', protect, dentistOrStaff, getPatientTreatments);
router.patch('/:id/pay', protect, staff, markTreatmentPaid); // Typically staff handles payments

export default router;

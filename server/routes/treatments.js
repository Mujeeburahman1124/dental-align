import express from 'express';
import { createTreatment, getPatientTreatments, getTreatmentSummary, getMyTreatments, getAllTreatments } from '../controllers/treatmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTreatment);
router.get('/summary', protect, getTreatmentSummary);
router.get('/my-treatments', protect, getMyTreatments);
router.get('/all', protect, getAllTreatments);
router.get('/patient/:patientId', protect, getPatientTreatments);

export default router;

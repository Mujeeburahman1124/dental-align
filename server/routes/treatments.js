import express from 'express';
import { createTreatment, getPatientTreatments, getTreatmentSummary, getMyTreatments } from '../controllers/treatmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTreatment);
router.get('/summary', protect, getTreatmentSummary);
router.get('/my-treatments', protect, getMyTreatments);
router.get('/patient/:patientId', protect, getPatientTreatments);

export default router;

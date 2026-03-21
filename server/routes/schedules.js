import express from 'express';
import { getDentistSchedule, checkAvailability, upsertSchedule, getAvailableDentists } from '../controllers/scheduleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, upsertSchedule);

router.get('/dentist/:dentistId', getDentistSchedule);
router.get('/check-availability', checkAvailability);
router.get('/available-dentists', getAvailableDentists);

export default router;

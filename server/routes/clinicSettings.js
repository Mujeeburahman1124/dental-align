import express from 'express';
import { getSchedule, updateSchedule } from '../controllers/clinicSettingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSchedule); // Allow public access to view slots
router.get('/schedule', getSchedule); // Alias
router.put('/', protect, admin, updateSchedule);
router.put('/schedule', protect, admin, updateSchedule); // Alias

export default router;

import express from 'express';
import { processPayment, getMyPayments, getBillingSummary, getAllPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, processPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/summary', protect, getBillingSummary);
router.get('/all', protect, getAllPayments);

export default router;

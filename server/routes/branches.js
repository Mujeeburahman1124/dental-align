import express from 'express';
import { getBranches, createBranch } from '../controllers/branchController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getBranches)
    .post(protect, admin, createBranch);

export default router;

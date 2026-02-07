import express from 'express';
import { getPatients, getDentists, getAllUsers, deleteUser, updateUserProfile } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.get('/patients', protect, getPatients);
router.get('/dentists', getDentists);
router.put('/profile', protect, updateUserProfile);
router.delete('/:id', protect, admin, deleteUser);

export default router;

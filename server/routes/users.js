import express from 'express';
import { getPatients, getDentists, getAllUsers, deleteUser, updateUserProfile, getUserProfile, updatePatientByStaff } from '../controllers/userController.js';
import { protect, admin, dentist, staff, dentistOrStaff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.get('/patients', protect, dentistOrStaff, getPatients); // Allow staff/dentists via dentistOrStaff middleware
router.get('/dentists', getDentists);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/:id', protect, dentistOrStaff, updatePatientByStaff);
router.delete('/:id', protect, admin, deleteUser);

export default router;

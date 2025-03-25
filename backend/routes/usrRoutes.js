import express from 'express';
import { fetchUsers, blockUsers, unblockUsers, deleteUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, fetchUsers);
router.post('/block', authMiddleware, blockUsers);
router.post('/unblock', authMiddleware, unblockUsers);
router.post('/delete', authMiddleware, deleteUsers);

export default router;

import express from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/noteController';
import { authenticateJWT } from '../middleware/authMiddleware'; 
import { login } from '../controllers/authController';

const router = express.Router();

router.post('/notes', authenticateJWT, createNote);
router.get('/notes', authenticateJWT, getNotes);
router.put('/notes/:id', authenticateJWT, updateNote);
router.delete('/notes/:id', authenticateJWT, deleteNote);


export default router;

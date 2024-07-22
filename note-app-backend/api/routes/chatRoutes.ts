import express from 'express';
import { createChat, getChats, getUsers } from '../controllers/chatController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/getChats/:userId',authenticateJWT, getChats);//fetch first time
router.get('/getUsers',authenticateJWT, getUsers); //for create new chat get users
router.post('/createChat',authenticateJWT, createChat); 

export default router;
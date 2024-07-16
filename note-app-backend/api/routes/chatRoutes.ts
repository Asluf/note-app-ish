import express from 'express';
import { getChats, sendChat } from '../controllers/chatController';

const router = express.Router();

router.get('/:userId', getChats);
router.post('/send', sendChat); 

export default router;
import { Request, Response } from 'express';
import Chat from '../models/chatModel';

// Fetch 
const getChats = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const chats = await Chat.find({ $or: [{ sender: userId }, { receiver: userId }] });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
};

// Send 
const sendChat = async (req: Request, res: Response) => {
    try {
        const { sender, receiver, message } = req.body;
        const newChat = new Chat({ sender, receiver, message });
        await newChat.save();
        res.status(201).json({ message: 'Chat sent successfully', chat: newChat });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send chat' });
    }
};

export { getChats, sendChat };

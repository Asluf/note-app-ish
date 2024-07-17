import { Request, Response } from 'express';
import Chat from '../models/chatModel';

const getChats = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const chats = await Chat.find({
            $or: [{ user1: userId }, { user2: userId }]
        })
            .populate('user1', 'username')
            .populate('user2', 'username')
            .lean();

        chats.forEach(chat => {
            chat.messages = chat.messages.slice(-10);
        });

        res.send({ success: true, chats });
    } catch (error) {
        res.send({ success: false, message: 'Failed to fetch chats' });
    }
};

// Send 
const sendChat = async (req: Request, res: Response) => {
    try {
        const { sender, receiver, message } = req.body;
        const newChat = new Chat({ sender, receiver, message });
        await newChat.save();
        res.send({ sucess: true, message: 'Chat sent successfully', chat: newChat });
    } catch (error) {
        res.send({ sucess: false, message: 'Failed to send chat' });
    }
};

export { getChats, sendChat };

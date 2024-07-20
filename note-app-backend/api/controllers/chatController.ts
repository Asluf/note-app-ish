import { Request, Response } from 'express';
import Chat from '../models/chatModel';
import User from '../models/userModel';
import mongoose from 'mongoose';

export const getChats = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const chats = await Chat.find({
            $or: [{ user1: userId }, { user2: userId }]
        })
            .populate('user1', 'username')
            .populate('user2', 'username')
            .lean();

        chats.forEach(chat => {
            const unreadMessages = chat.messages.filter(message => message.receiverId.toString() === userId && !message.readReceipt);
            let messageCount = unreadMessages.length + 20;
            chat.messages = chat.messages.slice(-messageCount);
        });

        res.send({ success: true, chats });
    } catch (error) {
        res.send({ success: false, message: 'Failed to fetch chats' });
    }
};
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({}, '_id email username');
        res.send({ success: true, users });
    } catch (error) {
        res.send({ success: false, message: "Failed to fetch users" });
    }
};

export const createChat = async (req: Request, res: Response): Promise<void> => {
    try {
        const chat = new Chat({
            user1: new mongoose.Types.ObjectId(req.body.user1),
            user2: new mongoose.Types.ObjectId(req.body.user2),
            messages: []
        });

        await chat.save();
        const savedChat = await Chat.findById(chat._id)
            .populate('user1', 'username')
            .populate('user2', 'username');

        if (!savedChat) {
            throw new Error("Chat not found");
        }

        res.send({ success: true, chat: savedChat });
    } catch (error) {
        console.error(error);
        res.send({ success: false, message: "Failed to create chat" });
    }
};

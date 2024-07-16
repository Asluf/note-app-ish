import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserSocket from '../models/userSocketModel';

const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        const userSocket = new UserSocket({userId:user._id});
        await userSocket.save();
        res.send({ success: true, message: "User created" });
    } catch (error) {
        res.send({ success: false, message: "An unknown error occurred" });   
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ success: false, message: "User not found"});  
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.send({ success: false, message: "Invalid password"}); 
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.send({ success: true, token: token, userId:user._id });
    } catch (error) {
        res.send({ success: false, message: "An unknown error occurred" });
    }
};


const logout = async (req: Request, res: Response) => {
    try {
        // Typically, for token-based auth, there's no server-side storage of tokens to invalidate.
        // Logout functionality usually involves clearing the token from the client-side (e.g., local storage).
        // Here, you might clear the token from the client-side or session if using session-based auth.
        res.send({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.send({ success: false, message: "An error occurred during logout" });
    }
};

export { signup, login , logout};
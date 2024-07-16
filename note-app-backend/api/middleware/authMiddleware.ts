import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { error } from 'console';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.send({ success:false, error: 'Access denied. No token provided.' });
  }

  try {
    const decodedUser:any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decodedUser.userId);
    req.user=user;
    if (!user) {
      console.log(error);
      return res.send({ success:false,error: 'Invalid token.' });
    }
    next();
  } catch (ex) {
    console.log(error);
    res.send({ success:false,error: 'Invalid token.' });
  }
};

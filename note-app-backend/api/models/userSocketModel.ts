import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSocket extends Document {
    userId: string;
    socketId: string;
}

const userSocketSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    socketId: { type: Schema.Types.ObjectId, default: null, required: false},
});

const UserSocket = mongoose.model<IUserSocket>('UserSocket', userSocketSchema);

export default UserSocket;
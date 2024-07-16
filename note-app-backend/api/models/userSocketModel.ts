import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserSocket extends Document {
    userId: Schema.Types.ObjectId;
    socketId: string | null;
}

const userSocketSchema = new Schema<IUserSocket>({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    socketId: { type: Schema.Types.String, default: null, required: false },
});

const UserSocket: Model<IUserSocket> = mongoose.model<IUserSocket>('UserSocket', userSocketSchema);

export default UserSocket;
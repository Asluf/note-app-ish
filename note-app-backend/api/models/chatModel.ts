import mongoose, { Schema, Document } from 'mongoose';

export interface IChat {
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    content: string;
    timestamp: Date;
}

const chatSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: false},
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IChat>('Chat', chatSchema);

import mongoose, { Schema, Document } from 'mongoose';

interface Chat extends Document {
    sender: string;
    receiver: string;
    message: string;
    timestamp: Date;
}

const chatSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<Chat>('Chat', chatSchema);

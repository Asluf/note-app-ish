import mongoose, { Schema, Document } from 'mongoose';

// export interface IChat {
//     senderId: Schema.Types.ObjectId;
//     receiverId: Schema.Types.ObjectId;
//     content: string;
//     timestamp: Date;
// }

// const chatSchema = new Schema({
//     senderId: { type: Schema.Types.ObjectId, ref: 'User' },
//     receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
//     content: { type: String, required: false},
//     timestamp: { type: Date, default: Date.now }
// });

// export default mongoose.model<IChat>('Chat', chatSchema);

export interface IMessage {
    _id: Schema.Types.ObjectId;
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    content: string;
    timestamp: Date;
    readReceipt: boolean;
}

export interface IChat{
    _id: Schema.Types.ObjectId;
    user1: Schema.Types.ObjectId;
    user2: Schema.Types.ObjectId;
    timestamp: Date;
    is_deleted1: boolean;
    is_deleted2: boolean;
    messages: IMessage[];
}

const messageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId},
    receiverId: { type: Schema.Types.ObjectId},
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readReceipt: { type: Boolean, default: false }
});

const chatSchema = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: 'User' },
    user2: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    is_deleted1: { type: Boolean, default: false },
    is_deleted2: { type: Boolean, default: false },
    messages: [messageSchema]
});

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
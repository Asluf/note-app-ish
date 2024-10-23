export interface Message {
    _id?: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp?: Date;
    readReceipt: boolean;
}
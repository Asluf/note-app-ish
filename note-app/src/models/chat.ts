import { Message } from "./message";
import { User } from "./user";

export interface Chat {
    _id: string;
    user1: User;
    user2: User;
    timestamp?: Date;
    is_deleted1?: boolean;
    is_deleted2?: boolean;
    messages?: Message[];
}
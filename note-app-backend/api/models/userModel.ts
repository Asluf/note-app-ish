import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
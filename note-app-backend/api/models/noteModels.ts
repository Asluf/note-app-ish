import mongoose, { Document, Schema } from 'mongoose';

interface INote extends Document {
    content: string;
    user: mongoose.Types.ObjectId;
}

const noteSchema: Schema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
});

export default mongoose.model<INote>('Note', noteSchema);
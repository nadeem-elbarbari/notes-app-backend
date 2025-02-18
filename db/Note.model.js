import mongoose from 'mongoose';
const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
export const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

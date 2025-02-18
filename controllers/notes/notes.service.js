import { Note } from '../../db/Note.model.js';
import * as db from '../../db/db.service.js';
export const createNote = async (req, res, next) => {
    try {
        const note = await db.create(Note, { ...req.body, owner: req.user?._id });
        return res.success(note, 'Note created successfully', 201);
    }
    catch (error) {
        return next(error);
    }
};
export const getNotes = async (req, res, next) => {
    try {
        const notes = await db.find(Note, { owner: req.user?._id });
        return res.success(notes, 'Notes retrieved successfully');
    }
    catch (error) {
        return next(error);
    }
};
export const updateNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const note = await db.updateById(Note, noteId, req.body);
        return res.success(note, 'Note updated successfully');
    }
    catch (error) {
        return next(error);
    }
};
export const deleteNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        await db.deleteOne(Note, { _id: noteId });
        return res.success(null, 'Note deleted successfully');
    }
    catch (error) {
        return next(error);
    }
};

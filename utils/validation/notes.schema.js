import Joi from 'joi';
import { Types } from 'mongoose';
const customValidation = (value, error) => {
    const isValid = Types.ObjectId.isValid(value);
    return isValid ? value : error.message(`invalid id: ${value}`);
};
export const createNoteSchema = Joi.object({
    title: Joi.string().min(3).max(10).required().messages({
        'string.empty': 'Text is required',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 20 characters long',
    }),
    description: Joi.string().min(3).max(100).messages({
        'any.required': 'description is required',
        'string.empty': 'description is required',
    }),
});
export const updateNoteSchema = Joi.object({
    title: Joi.string().min(3).max(10).messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be at most 20 characters long',
    }),
    description: Joi.string().min(3).max(100).messages({
        'string.min': 'description must be at least 3 characters long',
        'string.max': 'description must be at most 100 characters long',
    }),
    noteId: Joi.string().custom(customValidation, 'custom validation for noteId').required(),
});

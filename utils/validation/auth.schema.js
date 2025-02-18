import Joi from 'joi';
export const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 30 characters long',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .messages({
        'string.empty': 'Password is required',
        'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter and one number',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Re-password is required',
    }),
});
export const signinSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .messages({
        'string.empty': 'Password is required',
        'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter and one number',
    }),
});

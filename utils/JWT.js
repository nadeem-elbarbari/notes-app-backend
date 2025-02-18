import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
export const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    return token;
};
export const verifyToken = (token) => {
    const result = jwt.verify(token, JWT_SECRET);
    return result;
};

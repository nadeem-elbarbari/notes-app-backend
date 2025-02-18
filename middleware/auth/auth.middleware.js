import { verifyToken } from '../../utils/JWT.js';
import * as db from '../../db/db.service.js';
import { User } from '../../db/User.model.js';
import pkg from 'jsonwebtoken';
const { JsonWebTokenError } = pkg;

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const [Bearer, tokenValue] = token?.split(' ') ?? [];
        if (!tokenValue || Bearer !== 'Bearer') {
            return next(new Error('Unauthorized', { cause: 401 }));
        }
        const { id } = verifyToken(tokenValue);
        const user = await db.findOne(User, { _id: id });
        if (!user) {
            return next(new Error('User not found', { cause: 404 }));
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof JsonWebTokenError) {
            let message = 'Internal Server Error';
            switch (error?.name) {
                case 'JsonWebTokenError':
                    message = 'Invalid token';
                    error['cause'] = 401;
                    break;
                case 'TokenExpiredError':
                    message = 'Token expired';
                    error['cause'] = 401;
                    break;
                default:
                    message = error.message;
            }
            return next(new Error(message, { cause: 401 }));
        }
        return next(error);
    }
};

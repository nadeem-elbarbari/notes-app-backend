import { User } from '../../db/User.model.js';
import { compare } from '../../utils/bcrypt.js';
import { signToken } from '../../utils/JWT.js';
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser) {
        return next(new Error('User already exists', { cause: 400 }));
    }
    const user = await User.create({ name, email, password });
    return res.success(user, 'User created successfully', 201);
};
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error('Email not found', { cause: 404 }));
    }
    const match = compare(password, user.password);
    if (!match) {
        return next(new Error('Invalid password', { cause: 400 }));
    }
    const token = signToken(user._id);
    return res.success({ user, token }, 'Logged in successfully', 200);
};
export const checkToken = async (req, res, next) => {
    return res.success(req.user, 'Token is valid', 200);
};

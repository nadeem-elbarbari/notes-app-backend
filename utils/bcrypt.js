import bcrypt from 'bcrypt';
import { SALT } from '../config/env.js';
export const hash = (text) => {
    const result = bcrypt.hashSync(text, +SALT);
    return result;
};
export const compare = (text, hash) => {
    const result = bcrypt.compareSync(text, hash);
    return result;
};

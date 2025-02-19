import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
export const {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SALT,
    X_CLIENT_ID,
    X_CLIENT_SECRET,
    X_CALLBACK_URL,
    SESSION_SECRET,
} = process.env;

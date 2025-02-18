import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
export const { PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, SALT } = process.env;

import express from 'express';
import { PORT } from './config/env.js';
import { appController } from './controllers/app.controller.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
        origin: ['http://localhost:5000', 'https://notes-app-fullstack-wheat.vercel.app/'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

appController(app, express);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

import express from 'express';
import { PORT } from './config/env.js';
import { appController } from './controllers/app.controller.js';
import cors from 'cors';
const app = express();
app.use(
    cors({
        origin: ['http://localhost:5500', 'https://notes-app-pi-ecru.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

appController(app, express);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

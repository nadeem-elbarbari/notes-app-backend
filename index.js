import express from 'express';
import { PORT } from './config/env.js';
import { appController } from './controllers/app.controller.js';
import path from 'path';
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


appController(app, express);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

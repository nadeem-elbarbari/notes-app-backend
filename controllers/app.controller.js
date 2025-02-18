import successResponse from '../middleware/success/success.middleware.js';
import userRouter from './users/user.controller.js';
import noteRouter from './notes/notes.controller.js';
import { connectDB } from '../db/connection.js';
import { errorHandler } from '../middleware/error/errors.middleware.js';
export function appController(app, express) {
    app.use(express.json());
    app.use(express.static('public'));
    app.use(successResponse);
    app.use('/api/v1', [userRouter, noteRouter]);
    app.get('/api/v1', (req, res) => {
        res.json({ msg: 'Hello World' });
    });
    connectDB();
    app.use(errorHandler);
}

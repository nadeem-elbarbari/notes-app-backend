import successResponse from '../middleware/success/success.middleware.js';
import userRouter from './users/user.controller.js';
import noteRouter from './notes/notes.controller.js';
import { connectDB } from '../db/connection.js';
import { errorHandler } from '../middleware/error/errors.middleware.js';
import { SESSION_SECRET, X_CALLBACK_URL, X_CLIENT_ID, X_CLIENT_SECRET } from '../config/env.js';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { xAuth } from '../middleware/auth/twitter.js';

export function appController(app, express) {
    app.use(express.json());
    app.use(successResponse);
    app.use('/api/v1', [userRouter, noteRouter]);
    app.get('/api/v1', (req, res) => {
        res.json({ msg: 'Hello World' });
    });

    passport.use(
        new TwitterStrategy(
            {
                consumerKey: X_CLIENT_ID,
                consumerSecret: X_CLIENT_SECRET,
                callbackURL: X_CALLBACK_URL,
                passReqToCallback: true, // Passes req object to the callback
            },
            (req, token, tokenSecret, profile, done) => {
                return done(null, profile);
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login.html' }), xAuth);


    connectDB();
    app.use(errorHandler);
}

import successResponse from '../middleware/success/success.middleware.js';
import userRouter from './users/user.controller.js';
import noteRouter from './notes/notes.controller.js';
import { connectDB } from '../db/connection.js';
import { errorHandler } from '../middleware/error/errors.middleware.js';
import { SESSION_SECRET, X_CALLBACK_URL, X_CLIENT_ID, X_CLIENT_SECRET } from '../config/env.js';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { xAuth } from '../middleware/auth/twitter.js';
import session from 'express-session';

export function appController(app, express) {
    app.use(express.json());
    app.use(successResponse);
    app.use('/api/v1', [userRouter, noteRouter]);
    app.get('/api/v1', (req, res) => {
        res.json({ msg: 'Hello World' });
    });

    app.use(
        session({
            secret: SESSION_SECRET, // Secret to sign the session ID cookie
            resave: false, // Don't resave the session if it's not modified
            saveUninitialized: false, // Don't create a session if there's no data
            cookie: {
                httpOnly: true, // Makes the cookie inaccessible to JavaScript (important for security)
                secure: process.env.NODE_ENV === 'production', // Set to `true` in production for HTTPS (encrypted cookie)
                maxAge: 24 * 60 * 60 * 1000, // Set the cookie's expiration time (in milliseconds)
                sameSite: 'strict', // Controls cross-site cookie behavior (important for CSRF protection)
            },
        })
    );


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

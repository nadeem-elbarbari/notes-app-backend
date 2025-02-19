import { User } from '../../db/User.model.js';
import { signToken } from '../../utils/JWT.js';

export const xAuth = async (req, res, next) => {
    try {
        if (!req.user) return next(new Error('User not authenticated'));
        if (req.user.provider !== 'twitter') return next(new Error('Invalid provider'));

        if (req.user._json.suspended) {
            return next(new Error('Your account has been suspended.'));
        }

        const user = await User.findOne({ source: { name: 'twitter', id: req.user.id } });

        if (user) {
            return res.redirect(
                `https://notes-app-fullstack-rp7n.onrender.com/dashboard.html?token=${signToken(user._id)}`
            );
        }

        const userCreated = await User.create({
            name: req.user.username,
            source: {
                name: 'twitter',
                id: req.user.id,
            },
        });

        return res.redirect(
            `https://notes-app-fullstack-rp7n.onrender.com/dashboard.html?token=${signToken(userCreated._id)}`
        );
    } catch (error) {
        next(error);
    }
};

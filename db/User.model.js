import mongoose from 'mongoose';
import { hash } from '../utils/bcrypt.js';
var Source;
(function (Source) {
    Source['LOCAL'] = 'local';
    Source['GOOGLE'] = 'google';
    Source['FACEBOOK'] = 'facebook';
    Source['TWITTER'] = 'twitter';
})(Source || (Source = {}));
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: function () {
            return this.source.name === Source.LOCAL ? true : false;
        },
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.source === Source.LOCAL ? true : false;
        },
    },
    source: {
        name: {
            type: String,
            required: true,
            enum: Object.values(Source),
            default: Source.LOCAL,
        },
        id: {
            type: String,
        },
    },
});
UserSchema.pre('save', function (next) {
    if (this.source !== Source.LOCAL) {
        return next();
    }
    this.password = hash(this.password);
    next();
});
export const User = mongoose.model('User', UserSchema);

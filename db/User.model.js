import mongoose from 'mongoose';
import { hash } from '../utils/bcrypt.js';
var Source;
(function (Source) {
    Source["LOCAL"] = "local";
    Source["GOOGLE"] = "google";
})(Source || (Source = {}));
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.source === Source.LOCAL ? true : false;
        },
    },
    source: {
        type: String,
        required: true,
        enum: Object.values(Source),
        default: Source.LOCAL,
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

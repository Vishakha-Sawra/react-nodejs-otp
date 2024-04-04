const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp_code: {
        type: String,
        required: false
    },
    otp_expiration: {
        type: Date,
        required: false
    },
    is_verified: {
        type: Boolean,
        default: false
    },
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;
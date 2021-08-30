const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        accountNumber: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        emailAddress: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        identityNumber: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            set: v => bcrypt.hashSync(v, bcrypt.genSaltSync()),
        }
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'createdAt' } }
);

module.exports = mongoose.model('user', UserSchema);

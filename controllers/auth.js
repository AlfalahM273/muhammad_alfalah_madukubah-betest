const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const client = require('../services/cache');

const signUp = (req, res) => {
    const {
        userName,
        accountNumber,
        emailAddress,
        identityNumber,
        password,
    } = req.body;
    return User.create({
        userName: userName,
        accountNumber: accountNumber,
        emailAddress: emailAddress,
        identityNumber: identityNumber,
        password: password
    })
        .then(user => {
            client.del("user")
            const token = jwt.sign(
                {
                    id: user._id,
                    userName: user.userName,
                    emailAddress: user.emailAddress,
                    identityNumber: user.identityNumber
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: process.env.TOKEN_EXPIRY,
                }
            );
            res.status(201);
            res.json({
                token: token
            })
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

const signIn = async (req, res) => {
    try {
        let {
            userName,
            password,
        } = req.body;

        if (!(userName && password)) {
            res.status(400);
            res.json({
                errors: ["All input is required"]
            })
            return
        }
        const user = await User.findOne({ userName });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {
                    id: user._id,
                    userName: user.userName,
                    emailAddress: user.emailAddress,
                    identityNumber: user.identityNumber
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: process.env.TOKEN_EXPIRY,
                }
            );
            res.status(200);
            res.json({
                token: token
            })
            return;
        }
        res.status(400);
        res.json({
            errors: ["Invalid Credentials"]
        })
        return;
    } catch (err) {
        res.status(500);
        res.json({
            errors: [err.message]
        });
        return;
    }
}

module.exports = {
    signUp,
    signIn,
}

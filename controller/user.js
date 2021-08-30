const User = require('../model/user');

const serialize = (data) => (
    {
        _id: data._id,
        userName: data.userName,
        accountNumber: data.accountNumber,
        emailAddress: data.emailAddress,
        identityNumber: data.identityNumber
    }
);

const index = (_, res) => {
    return User.find()
        .then(users => {
            res.status(201);
            res.json(users.map(val => serialize(val)));
        })
        .catch(err => {
            res.status(500);
            res.json({
                errors: [err.message]
            });
        })
}

const show = (req, res) => {
    let id = req.params.userId;
    return User.findById(id)
        .then(user => {
            if (user) {
                res.status(200);
                res.json(serialize(user));
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(err => {
            res.status(404);
            res.json({
                errors: [err.message]
            });
        })
}

const create = (req, res) => {
    let {
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
            res.status(201);
            res.json(serialize(user));
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

const update = (req, res) => {
    let id = req.params.userId;
    let newdata = req.body;
    return User.findByIdAndUpdate(id, newdata, { runValidators: true })
        .then(result => {
            if (result) {
                return User.findById(result._id).then(user => {
                    res.status(201);
                    res.json(serialize(user));
                });
            }
            else {
                res.status(404);
                res.json({
                    errors: ["Not Found"]
                });
            }
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

const unlink = (req, res) => {
    let id = req.params.userId;
    return User.findByIdAndRemove(id)
        .then(_ => {
            res.status(201);
            res.json({
                message: "successfully deleted"
            });
        })
        .catch(err => {
            res.status(422);
            res.json({
                errors: [err.message]
            });
        })
}

module.exports = {
    index,
    show,
    create,
    update,
    unlink
}

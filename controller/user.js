const User = require('../model/user');
const { client } = require('../services/cache')

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
    const redisKey = 'user';
    client.get(redisKey, async (err, data) => {
        if (data) {
            res.status(200);
            res.json(JSON.parse(data));
            return;
        } else {
            return User.find()
                .then(users => {
                    client.set(redisKey, JSON.stringify(users.map(val => serialize(val))), 'EX', 60); // simpan hasil request ke dalam redis dalam bentuk JSON yang sudah di jadikan string, kita setting expired selaman 60 (detik)            
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
    });

}

const show = (req, res) => {
    const id = req.params.userId;
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

const getUserByAccountNumber = (req, res) => {
    const accountNumber = req.params.accountNumber;
    return User.findOne({ accountNumber: accountNumber })
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

const getUserByIdentityNumber = (req, res) => {
    const identityNumber = req.params.identityNumber;
    return User.findOne({ identityNumber: identityNumber })
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
            client.del("user")
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
                    client.del("user")
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
        .catch(error => {
            if(error.code && error.code === 11000){
                error.message = "";
                error.message = Object.keys(error.keyValue).join(", ")
                error.message += " already taken";
            }
            res.status(422);
            res.json({
                errors: [error.message]
            });
        })
}

const unlink = (req, res) => {
    let id = req.params.userId;
    if (id == req.user.id) {
        res.status(422);
        res.json({
            errors: ["Cannot delete your own data"]
        });
        return;
    }
    return User.findByIdAndRemove(id)
        .then(_ => {
            client.del("user")
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
    unlink,
    getUserByAccountNumber,
    getUserByIdentityNumber,
}

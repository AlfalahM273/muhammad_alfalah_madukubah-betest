const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

router.route('/')
    .get(userController.index)
    .post(userController.create);

router.route('/:userId')
    .get(userController.show)
    .patch(userController.update)
    .delete(userController.unlink);

module.exports = router;

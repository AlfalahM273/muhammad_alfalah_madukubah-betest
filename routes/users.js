const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const jwtAuth = require('../middlewares/auth');

router.use([
    jwtAuth,
]);

router.route('/')
    .get(userController.index)
    .post(userController.create);

router.route('/:userId')
    .get(userController.show)
    .patch(userController.update)
    .delete(userController.unlink);

router.route('/AccountNumber/:accountNumber')
    .get(userController.getUserByAccountNumber);

router.route('/IdentityNumber/:identityNumber')
    .get(userController.getUserByIdentityNumber);

module.exports = router;

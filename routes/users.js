const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const loginStrategy = require('../strategies/login-strategy');

/* GET users listing. */
router.get('/', userController.getAll);
// get by id
router.get('/:id', userController.get);
// get by mail
router.get('/:email', userController.getByEmail);
// create user
router.post('/new-user', userController.create);
// edit user
router.put('/edit-user/:id', userController.update);
// remove user
router.delete('/remove-user/:id', userController.delete);
// user login
router.post('/login', loginStrategy.login);
// user logout
router.get('logout', loginStrategy.logout);

module.exports = router;

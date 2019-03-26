const express = require('express');
const passport = require('passport');

const router = express.Router();
const userController = require('../controllers/userController');
const customerController = require('../controllers/customerController');
const loginStrategy = require('../controllers/login-strategy');
const ensureToken = require('../strategies/auth-authorization');


/* GET users listing. */
router.get('/', ensureToken, passport.authenticate('jwt', { session: false }), userController.getAll);
// get by id
router.get('/:id', ensureToken, passport.authenticate('jwt', { session: false }), userController.get);
// get by mail
router.get('/:email', ensureToken, passport.authenticate('jwt', { session: false }), userController.getByEmail);
// create admin
router.post('/new-user', userController.create);
// new customer
router.post('/new-customer', customerController.createCustomer);

// edit user
router.put('/edit-user/:id', ensureToken, passport.authenticate('jwt', { session: false }), userController.update);
// remove user
router.delete('/remove-user/:id', ensureToken, passport.authenticate('jwt', { session: false }), userController.delete);
// user login
router.post('/login', loginStrategy.login);
// user logout
router.get('logout', loginStrategy.logout);

module.exports = router;

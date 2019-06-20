const express = require('express');
const passport = require('passport');
const expressJoi = require('express-joi-validator');
const adminSchema = require('./userSchema');

const router = express.Router();
const { AdminController, CustomerController } = require('./userController');
const loginStrategy = require('../strategies/loginStrategy');
const ensureToken = require('../strategies/authAuthorization');


/* GET users listing. */
router.get('/', ensureToken, passport.authenticate('jwt', { session: false }), AdminController.index);
// get by id
router.get('/:id', ensureToken, passport.authenticate('jwt', { session: false }), AdminController.get);
// create admin
router.post('/new-user', expressJoi(adminSchema), AdminController.create);
// new customer


// edit user
router.put('/edit-user/:id', ensureToken, passport.authenticate('jwt', { session: false }), AdminController.update);
// remove user
router.delete('/remove-user/:id', ensureToken, passport.authenticate('jwt', { session: false }), AdminController.delete);
// user login
router.post('/login', loginStrategy.login);
// user logout
router.get('logout', loginStrategy.logout);

module.exports = router;

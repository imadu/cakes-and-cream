const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const randToken = require('rand-token');
const config = require('../config')();


const loginController = {
  login(req, res) {
    // validation on the form
    const refreshTokens = {};
    req.checkBody('username', 'email cannot be empty').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) return res.status(400).send({ error: 'something went wrong', errors });

    passport.authenticate('login', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).send({
          message: info ? info.message : 'username or password incorrect',
          user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.status(400).send(error);
        }
        const body = {
          _id: user.id, username: user.username, role: user.role, location: user.location,
        };
        const token = jwt.sign({ user: body }, config.secret, {
          expiresIn: config.tokenExpiresIn,
        });
        const refreshToken = randToken.uid(256);
        refreshTokens[refreshToken] = body.username; 
        const returnedBody = {
          _id: user.id,
          email: user.email,
          role: user.role,
        };
        return res.json({ success: true, user: returnedBody, tokenid: `Bearer ${token}`, refreshToken });
      });
    })(req, res);
  },
  logout(req, res) {
    req.logout();
    res.redirect('/');
  },
};

module.exports = loginController;

const jwt = require('jsonwebtoken');
const passport = require('passport');
// const randToken = require('rand-token');
const config = require('../config')();


const loginController = {
  // eslint-disable-next-line consistent-return
  login(req, res) {
    // validation on the form
    // onst refreshTokens = {};
    req.checkBody('username', 'username cannot be empty').notEmpty();
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
          _id: user.id, username: user.username, role: user.role, substore: user.substore,
        };
        const token = jwt.sign({ user: body }, config.secret, {
          expiresIn: config.tokenExpiresIn,
        });
        // const refreshToken = randToken.uid(256);
        // refreshTokens[refreshToken] = body.username; 
        const returnedBody = {
          _id: user.id,
          email: user.email,
          role: user.role,
          substore: user.substore,
        };
        return res.json({ success: true, user: returnedBody, tokenid: `Bearer ${token}` });
      });
    })(req, res);
  },

  // eslint-disable-next-line consistent-return
  loginCustomer(req, res) {
    req.checkBody('email', 'email cannot be empty').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) return res.status(400).send({ error: 'something went wrong', errors });

    passport.authenticate('customer-login', { session: false }, (err, customer, info) => {
      if (err || !customer) {
        return res.status(400).send({
          message: info ? info.message : 'username or password incorrect',
          customer,
        });
      }
      req.login(customer, { session: false }, (error) => {
        if (error) {
          res.status(400).send(error);
        }
        const body = {
          _id: customer.id,
          customer: customer.email,
        };
        const token = jwt.sign({ customer: body }, config.secret, {
          expiresIn: config.tokenExpiresIn,
        });
        // const refreshToken = randToken.uid(256);
        // refreshTokens[refreshToken] = body.customername; 
        const returnedBody = {
          _id: customer.id,
          email: customer.email,
        };
        return res.json({ success: true, customer: returnedBody, tokenid: `Bearer ${token}` });
      });
    })(req, res);
  },

  logout(req, res) {
    req.logout();
    res.redirect('/');
  },
};

module.exports = loginController;

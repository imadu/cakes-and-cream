/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');

const { ExtractJwt } = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

module.exports = (passport) => {
  const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
  // Passport needs to be able to serialize and deserialize
  // users to support persistent login sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
    const logger = console.log('serializing user:', user.email);
    return logger;
  });
  // passport will also deserialize the user
  passport.deserializeUser((id, done) => {
    if (id != null) {
      done(null, id);
      console.log('deserialising user: ', id);
    }
  });
  // passport jwt strategy
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.AUTH_SECRET;

  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload.user._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }
    });
  }));

  // Create a passport middleware to handle User login
  passport.use('login', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
    // check in mongo if a user with username exists or not
      User.findOne({ email }, (err, user) => {
      // In case of any error, return using the done method
        if (err) {
          return done(err);
        }
        // Username does not exist, log the error and redirect back
        if (!user) {
          console.log(`User Not Found with username ${email}`);
          return done(null, false);
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)) {
          console.log('Invalid Password');
          return done(null, false); // redirect back to login page
        }
        // User and password both match, return user from done method
        // which will be treated like success
        return done(null, user);
      });
    },
  ));
};

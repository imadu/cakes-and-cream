const jwt = require('jsonwebtoken');
const config = require('../../../config')();

function ensureToken(req, res, next) {
  // grab the token from the header
  const token = req.headers.authorization;
  if (typeof token !== 'undefined') {
    // split the  token
    const split = token.split(' ');
    const splitToken = split[1];
    req.token = splitToken;
    // verify  the split token
    jwt.verify(req.token, config.secret, (err, data) => {
      if (err) {
        res.status(500).send({ success: false, message: 'a user is still logged in, please log out ', err });
      } else {
        // if token is verified create this  template
        const template = {
          id: data.user._id,
          email: data.user.email,
          role: data.user.role,
          substore: data.user.substore,
        };
          // and assign the  template to the global variable
        req.createdBy = template;
      }
    });
    next();
  } else {
    res.status(403);
  }
}
module.exports = ensureToken;

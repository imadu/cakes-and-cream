const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
  firstname: String,
  lastname: String,
  email: { type: String, lowercase: true, required: true },
  location: {
    type: String, enum: ['IKJ', 'OJB', 'VI', 'SUR', 'ALL'], default: 'ALL', required: true,
  },
  role: { type: String, enum: ['superadmin', 'admin', 'registered'], default: 'registered' },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: String, default: '' },
});

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});
UserSchema.methods.comparePassword = (userPassword, cb) => {
  bcrypt.compare(userPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

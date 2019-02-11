const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
  firstname: String,
  lastname: String,
  email: { type: String, lowercase: true, required: true },
  location: { type: String, enum: ['IKJ', 'OJB', 'VI', 'SUR', 'ALL'], default: 'ALL' },
  role: { type: String, enum: ['superadmin', 'admin', 'registered'], default: 'registered' },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: String },
});

UserSchema.pre('save', (password, next) => {
  const user = this;
  if (!user.isModified('password')) return next();
  const createHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  this.password = createHash;
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

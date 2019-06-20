const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../../config')();

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SALT_WORK_FACTOR = 10;

const roleSchema = new Schema({
  name: String,
  privileges: {
    type: String, enum: config.adminSubStore, default: config.adminSubStore[0], required: true,
  },
  storeId: { type: ObjectId, ref: 'Store'},
});

const UserSchema = new Schema({
  username: {
    type: String, lowercase: true, required: true,
  },
  password: { type: String, required: true },
  fullName: String,
  email: { type: String, lowercase: true, required: true },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: String, default: '' },
  role: { roleSchema },
  avartar: { name: String, url: String },
  storeId: { type: ObjectId, ref: 'Store' },
});

const CustomerSchema = new Schema({
  email: {
    type: String, lowercase: true, required: true,
  },
  password: { type: String, required: true },
  fullName: String,
  address: [{ name: String, city: String, state: String }],
  createdAt: { type: Date, default: new Date() },
  storeId: { type: ObjectId, ref: 'Store' },
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

CustomerSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

CustomerSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

const AdminModel = mongoose.model('User', UserSchema);
const CustomerModel = mongoose.model('Customer', CustomerSchema);
const RoleModel = mongoose.model('Roles', roleSchema);

module.exports = { AdminModel, CustomerModel, RoleModel };

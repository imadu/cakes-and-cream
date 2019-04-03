const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 8;

const CustomerSchema = new Schema({
  customerId: { type: String },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  addressList: [{
    address: { type: String },
  }],
  createdAt: { type: Date, default: new Date() },
});

// eslint-disable-next-line func-names
// eslint-disable-next-line consistent-return
// eslint-disable-next-line func-names
CustomerSchema.pre('save', function (next) {
  const customer = this;
  // only hash the password if it has been modified (or is new)
  if (!customer.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(customer.password, salt, null, (err, hash) => {
      if (err) return next(err);
      customer.password = hash;
      next();
    });
  });
});
CustomerSchema.methods.comparePassword = (customerPassword, cb) => {
  bcrypt.compare(customerPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;

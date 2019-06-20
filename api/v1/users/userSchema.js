// import Joi from 'Joi';
const Joi = require('joi');

const signUpSchema = {
  password: Joi.string().min(8).max(16).required(),
  email: Joi.string().email().required(),
};

const adminSchema = {
  body: {
    ...signUpSchema,
    username: Joi.string().required(),
    fullname: Joi.string().required(),
  },
};

module.exports = { adminSchema };

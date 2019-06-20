const Joi = require('joi');

const optionsSchema = Joi.object().keys({
  option: Joi.string().lowercase(),
  value: Joi.number(),
});
const attributesSchema = Joi.object().keys({
  name: Joi.string().required(),
  options: optionsSchema,
});

const productsSchema = Joi.object().keys({
  name: Joi.string().lowercase(),
  price: Joi.number(),
  quantity: Joi.number(),
  attributes: attributesSchema,
});

const baseSchema = {
  customerName: Joi.string().lowercase().required(),
  customerPhone: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  products: productsSchema,
};

const orderSchema = {
  body: {
    ...baseSchema,
  },
};
module.exports = { orderSchema };
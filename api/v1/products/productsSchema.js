const Joi = require('joi');

const optionsSchema = Joi.object().keys({
  option: Joi.string().lowercase(),
  value: Joi.number(),
});
const attributesSchema = Joi.object().keys({
  name: Joi.string().required(),
  options: optionsSchema,
});
const baseSchema = {
  name: Joi.string().lowercase().required(),
  basePrice: Joi.number().positive().required(),
  category: Joi.string().lowercase().required(),
  attributes: attributesSchema,
};

const productSchema = {
  body: {
    ...baseSchema,
  },
};

module.exports = { productSchema };

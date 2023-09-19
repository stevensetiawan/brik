const Joi = require('joi');

module.exports = {
  validate_create_product: {
    body: Joi.object({
      name: Joi.string()
        .required()
        .min(2)
        .max(128),
      description: Joi.string()
        .required()
        .min(2)
        .max(200),
      sku: Joi.string()
        .required()
        .min(3)
        .max(50),
      harga: Joi.number()
        .integer()
        .required(),
      weight: Joi.number()
        .integer()
        .required(),
      height: Joi.number()
        .integer()
        .required(),
      width: Joi.number()
        .integer()
        .required(),
      length: Joi.number()
        .integer()
        .required(),
      categoryid: Joi.number()
        .integer()
        .required()
    })
  },
  validate_update_product: {
    params: Joi.object({
      id: Joi.number()
         .integer()
         .required()
    }),
    body: Joi.object({
      name: Joi.string()
        .min(2)
        .max(128),
      description: Joi.string()
        .min(2)
        .max(200),
      harga: Joi.number()
        .integer(),
      weight: Joi.number()
        .integer(),
      height: Joi.number()
        .integer(),
      width: Joi.number()
        .integer(),
      length: Joi.number()
        .integer(),
      categoryid: Joi.number()
        .integer()
    }),
  }
};

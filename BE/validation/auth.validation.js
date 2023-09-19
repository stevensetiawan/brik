const Joi = require('joi');

module.exports = {
  val_register: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .min(6)
        .max(128),
      name: Joi.string()
        .optional()
        .min(3)
        .max(100)
    }),
  },


  // val_update: {
  //   params:{
  //     id: Joi.number()
  //        .integer()
  //        .required()
  //   },

  //   body: {
  //     email: Joi.string()
  //     .email()
  //     .required(),
  //   password: Joi.string()
  //     .required()
  //     .min(6)
  //     .max(128),
  //   role: Joi.string()
  //     .required()
  //     .min(6)
  //     .max(128),
  //   name: Joi.string()
  //     .optional()
  //     .min(3)
  //     .max(100),
  //   phone: Joi.string()
  //     .optional()
  //     .min(3)
  //     .max(16),
  //   store_id: Joi.number()
  //     .integer()
  //     .required(),
  //   },
  // },

  val_login: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .max(128),
    }),
  },
};

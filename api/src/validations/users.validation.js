const Joi = require('joi');

const userCredentials = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  }),
};

const userRegisterCredentials = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    company: Joi.string().required(),
    phone: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

const userToModify = {
  body: Joi.object().keys({
    email: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    description: Joi.string(),
    linkedin: Joi.string(),
    phone: Joi.string(),
    photo: Joi.any(),
    photo_name: Joi.string(),
  }),
};

const userProfile = {
  body: Joi.object().keys({
    reference: Joi.string()
  }),
};

module.exports = {
  userCredentials,
  userToModify,
  userProfile,
  userRegisterCredentials
};

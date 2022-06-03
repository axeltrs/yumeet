const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    AIRTABLE_API_KEY: Joi.string().required().description('The token to your secret API token'),
    JWT_SECRET: Joi.string().required().description('JWT secret key')
  })
  .unknown();

const {
  value: envVars,
  error
} = envVarsSchema.prefs({
  errors: {
    label: 'key'
  }
}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  apiKey: {
    airtable: envVars.AIRTABLE_API_KEY
  }
};
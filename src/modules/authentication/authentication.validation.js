import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

/* Validation schema for email and password */

const emailField = Joi.string()
  .email()
  .required()
  .messages(customMessages("email"));
const passwordField = Joi.string()
  .pattern(/^[A-Z][A-Za-z0-9]{3,40}$/)
  .required()
  .messages(customMessages("password"));

/* Validation schema for register  */

const registerValidation = {
  body: Joi.object({
    name: Joi.string()
      .max(15)
      .min(3)
      .required()
      .messages(customMessages("name")),
    email: emailField,
    password: passwordField,
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages(customMessages("confirm password")),
    phone: Joi.number().required().messages(customMessages("phone number")),
    address: Joi.string().required().messages(customMessages("address")),
  }),
};

/* Validation schema for login  */

const loginValidation = {
  body: Joi.object({
    email: emailField,
    password: passwordField,
  }),
};

/* Validation schema for forgot password  */

const forgotPasswordValidation = {
  body: Joi.object({
    email: emailField,
  }),
};

/* Validation schema for reset password  */

const resetPasswordValidation = {
  body: Joi.object({
    code: Joi.string().required().messages(customMessages("code")),
    email: emailField,
    newPassword: passwordField,
  }),
};

export {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
};

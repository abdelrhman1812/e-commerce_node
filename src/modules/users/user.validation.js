import Joi from "joi";
import sharedValidation from "../../utils/sharedValidation.js";
import customMessages from "../../utils/validationMessages.js";

// Example usage for specific fields
const updateUserAccountValidation = {
  body: Joi.object({
    name: Joi.string().max(15).min(3).trim().messages(customMessages("name")),
    email: Joi.string().email().trim().messages(customMessages("email")),
    phone: Joi.string()
      .pattern(/^[0-9]+$/) // Assuming phone should be numeric

      .messages(customMessages("phone number")),
    address: Joi.string().trim().messages(customMessages("address")),
  }),
};

const changePasswordValidation = {
  body: Joi.object({
    currentPassword: Joi.string()
      .pattern(/^[A-Z][A-Za-z0-9]{3,40}$/)
      .required()
      .messages(customMessages("current Password")),
    newPassword: Joi.string()
      .pattern(/^[A-Z][A-Za-z0-9]{3,40}$/)
      .required()
      .messages(customMessages("New Password")),
  }),
};

const uploadUserImageValidation = {
  file: sharedValidation.file,
};

export {
  changePasswordValidation,
  updateUserAccountValidation,
  uploadUserImageValidation,
};

import Joi from "joi";
import sharedValidation from "../../utils/sharedValidation.js";
import customMessages from "../../utils/validationMessages.js";

const addBrandValidation = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .trim()
      .messages(customMessages("The Brand name"))
      .required(),
  }).required(),
  file: sharedValidation.file.required(),
};

const updateBrandValidation = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .trim()
      .messages(customMessages("The Brand name")),
  }),
  file: sharedValidation.file,
};

export { addBrandValidation, updateBrandValidation };

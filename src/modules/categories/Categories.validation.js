import Joi from "joi";
import sharedValidation from "../../utils/sharedValidation.js";
import customMessages from "../../utils/validationMessages.js";

const addCategoryValidation = {
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .trim()
      .messages(customMessages("The category name"))
      .required(),
  }),
  file: sharedValidation.file.required(),
};

const updateCategoryValidation = {
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .trim()
      .messages(customMessages("The category name")),
  }),
  file: sharedValidation.file,

  // params: Joi.string()
  //   .hex()
  //   .length(24)
  //   .required()
  //   .messages(customMessages("The category ID")),
};

export { addCategoryValidation, updateCategoryValidation };

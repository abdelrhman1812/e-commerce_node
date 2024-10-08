import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

// Custom function for generating validation messages

const addToCartValidation = {
  body: Joi.object({
    productId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages(customMessages("The product ID")),
    quantity: Joi.number()
      .integer()
      .min(1)
      .messages(customMessages("The quantity")),
  }).required(),
};

const updateCartValidation = {
  body: Joi.object({
    quantity: Joi.number()
      .integer()
      .min(1)
      .messages(customMessages("The quantity")),
  }),

  id: Joi.string().hex().length(24).messages(customMessages("The cart ID")),
};

export { addToCartValidation, updateCartValidation };

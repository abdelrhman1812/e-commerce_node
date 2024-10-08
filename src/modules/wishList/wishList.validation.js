import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

// Custom function for generating validation messages

const addToWishListValidation = {
  body: Joi.object({
    productId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages(customMessages("The product ID")),
  }).required(),
};

export { addToWishListValidation };

import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

const orderValidation = {
  body: Joi.object({
    shoppingAddress: Joi.object({
      street: Joi.string()
        .required()
        .min(3)
        .max(100)
        .messages(customMessages("Street")),
      city: Joi.string()
        .required()
        .min(2)
        .max(50)
        .messages(customMessages("City")),
      phone: Joi.string()
        .required()
        .pattern(new RegExp("^[0-9]{10,15}$"))
        .messages(customMessages("Phone")),
    }).required(),
  }),
};

export default orderValidation;

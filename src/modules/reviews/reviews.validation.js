import Joi from "joi"; // Ensure you import Joi
import customMessages from "../../utils/validationMessages.js";

const addReviewValidation = {
  body: Joi.object({
    rate: Joi.number().min(1).max(5).messages(customMessages("Rating")),

    comment: Joi.string().required().messages(customMessages("Comment")),
  }),

  params: Joi.object({
    productId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages(customMessages("The product ID")),
  }),
};

export { addReviewValidation };

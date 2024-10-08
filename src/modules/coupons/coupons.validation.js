import Joi from "joi";

const customMessages = (fieldName) => ({
  "string.empty": `${fieldName} cannot be empty.`,
  "string.min": `${fieldName} must be at least {#limit} characters long.`,
  "string.max": `${fieldName} must not exceed {#limit} characters.`,
  "any.required": `${fieldName} is required.`,
  "number.base": `${fieldName} must be a valid number.`,
  "number.min": `${fieldName} must be at least {#limit}.`,
  "number.max": `${fieldName} must not exceed {#limit}.`,
  "number.integer": `${fieldName} must be an integer.`,
  "date.greater": `${fieldName} must be later than the current date.`,
  "date.base": `${fieldName} must be a valid date.`,
  "any.only": `${fieldName} must be later than the start date.`,
});

/* Validation schema for add coupon  */

const addCouponValidation = {
  body: Joi.object({
    code: Joi.string()
      .min(3)
      .max(10)
      .required()
      .messages(customMessages("The coupon code")),
    amount: Joi.number()
      .min(1)
      .max(99)
      .integer()
      .required()
      .messages(customMessages("The discount amount")),
    fromDate: Joi.date()
      .greater(Date.now())
      .required()
      .messages(customMessages("The start date")),
    toDate: Joi.date()
      .greater(Joi.ref("fromDate"))
      .required()
      .messages(customMessages("The end date")),
  }).required(),
};

/* Validation schema for update coupon  */

const updateCouponValidation = {
  body: Joi.object({
    code: Joi.string()
      .min(3)
      .max(10)
      .messages(customMessages("The coupon code")),
    amount: Joi.number()
      .min(1)
      .max(99)
      .integer()
      .messages(customMessages("The discount amount")),
    fromDate: Joi.date()
      .greater(Date.now())
      .messages(customMessages("The start date")),
    toDate: Joi.date()
      .greater(Joi.ref("fromDate"))
      .messages(customMessages("The end date")),
  }),
};

export { addCouponValidation, updateCouponValidation };

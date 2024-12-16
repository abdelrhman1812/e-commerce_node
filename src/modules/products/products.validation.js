import Joi from "joi";
import sharedValidation from "../../utils/sharedValidation.js";
import customMessages from "../../utils/validationMessages.js";

/* Validation schema for add product  */

const addProductValidation = {
  body: Joi.object({
    title: Joi.string()
      .min(2)
      .max(60)
      .trim()
      .required()
      .messages(customMessages("The product title")),
    description: Joi.string()
      .trim()
      .required()
      .messages(customMessages("The product description")),
    price: Joi.number()
      .required()
      .messages(customMessages("The product price")),
    category: Joi.string()
      .hex()
      .length(24)
      .trim()
      .required()
      .messages(customMessages("The category ID")),
    brand: Joi.string()
      .hex()
      .length(24)
      .trim()
      .required()
      .messages(customMessages("The brand ID")),
    stock: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages(customMessages("The stock quantity")),
    discount: Joi.number()
      .min(0)
      .max(100)
      .messages(customMessages("The discount percentage")),
  }),
  files: Joi.object({
    imageCover: Joi.array()
      .items(sharedValidation.file.required())
      .min(1)
      .required()
      .messages(customMessages("The image cover")),
    images: Joi.array()
      .items(sharedValidation.file.required())
      .min(1)
      .required()
      .messages(customMessages("The product images")),
  }).required(),
};

/* Validation schema for update product  */

/* Validation schema for add product  */

const updateProductValidation = {
  body: Joi.object({
    title: Joi.string()
      .min(2)
      .max(60)
      .trim()
      .messages(customMessages("The product title")),
    description: Joi.string()
      .trim()
      .messages(customMessages("The product description")),
    price: Joi.number().messages(customMessages("The product price")),
    category: Joi.string()
      .hex()
      .length(24)
      .trim()
      .messages(customMessages("The category ID")),
    brand: Joi.string()
      .hex()
      .length(24)
      .trim()
      .messages(customMessages("The brand ID")),
    stock: Joi.number()
      .integer()
      .min(1)
      .messages(customMessages("The stock quantity")),
    discount: Joi.number()
      .min(0)
      .max(100)
      .messages(customMessages("The discount percentage")),
  }),
  files: Joi.object({
    imageCover: Joi.array()
      .items(sharedValidation.file.required())
      .min(1)
      .messages(customMessages("The image cover")),
    images: Joi.array()
      .items(sharedValidation.file.required())
      .min(1)
      .messages(customMessages("The product images")),
  }).required(),
};

/* Validation schema for get Product */

const getProductValidation = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages(customMessages("The product ID")),
});

export { addProductValidation, getProductValidation, updateProductValidation };

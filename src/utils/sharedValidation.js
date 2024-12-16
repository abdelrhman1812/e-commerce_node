import Joi from "joi";
const sharedValidation = {
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
  }).messages({
    "any.required": "File is required",
  }),

  headers: Joi.object({
    token: Joi.string().required(),
  }),
};

export default sharedValidation;

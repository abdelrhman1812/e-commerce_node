import AppError from "../utils/appError.js";

let dataMethod = ["body", "params", "query", "headers", "file", "files"];

export const validation = (schema) => {
  return (req, res, next) => {
    let arrErrors = [];

    dataMethod.forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
        if (error?.details) {
          arrErrors.push(
            ...error.details.map((err) => {
              return err.message.replace(/"/g, "");
            })
          );
        }
      }
    });

    if (arrErrors.length) {
      const errorMessage = arrErrors.join("; ");

      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

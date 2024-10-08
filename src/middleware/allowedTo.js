import AppError from "../utils/appError.js";
import { messages } from "../utils/messages.js";

const allowedTo = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      next(new AppError(messages.user.notAuthorized, 401));
    }
  };
};

export default allowedTo;

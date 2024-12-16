import jwt from "jsonwebtoken";
import UserModel from "../../database/models/user.model.js";
import AppError from "../utils/appError.js";
import { messages } from "../utils/messages.js";
import catchError from "./catchError.js";

const protectedRoute = catchError(async (req, res, next) => {
  const { token } = req.headers;

  /* Check If Token Exist   */

  if (!token) return next(new AppError(messages.token.tokenProvider, 401));

  /* Verify Token */

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  /* Check if payload || if token is not valid " signature " */

  if (!decode?.userId)
    return next(new AppError(messages.token.invalidToken, 401));

  /* Check If User Exist */

  const user = await UserModel.findById(decode.userId);
  if (!user) return next(new AppError(messages.user.notFound, 401));

  if (user.passwordChangedAt) {
    /* Check Time of change Password */
    const time = parseInt(user?.passwordChangedAt?.getTime() / 1000);

    if (time > decode.iat)
      return next(
        new AppError(messages.token.invalidToken + " " + "Login agin ", 401)
      );
  }

  // /* Check If User Login or no */

  // if (user.status == status.OFFLINE)
  //   return next(new AppError(messages.user.mustLogin, 401));

  req.user = user;

  next();
});

export default protectedRoute;

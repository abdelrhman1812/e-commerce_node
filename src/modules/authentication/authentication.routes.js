import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import { validation } from "../../middleware/validation.js";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "./authentication.controller.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
} from "./authentication.validation.js";

const authenticationRouter = Router();

/* ========= Register ========= */

authenticationRouter.post(
  "/register",
  validation(registerValidation),
  catchError(register)
);

/* ========= Login ========= */
authenticationRouter.post(
  "/login",
  validation(loginValidation),
  catchError(login)
);

/* ========= Forgot Password ========= */

authenticationRouter.post(
  "/forgot-password",
  validation(forgotPasswordValidation),
  catchError(forgotPassword)
);

/* ========= Reset Password ========= */

authenticationRouter.put(
  "/reset-password",
  validation(resetPasswordValidation),
  catchError(resetPassword)
);

export default authenticationRouter;

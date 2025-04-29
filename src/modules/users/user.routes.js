import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import multerHost, { validationExtensions } from "../../services/multerHost.js";
import {
  changePassword,
  getLoggedUserAccount,
  updateUserAccount,
  uploadUserImage,
} from "./user.controller.js";
import {
  changePasswordValidation,
  updateUserAccountValidation,
  uploadUserImageValidation,
} from "./user.validation.js";

const userRouter = Router();

/* ================ Update User account ================ */

userRouter.put(
  "/update-account",
  protectedRoute,
  validation(updateUserAccountValidation),
  catchError(updateUserAccount)
);

/* ========= Change user password ================= */

userRouter.put(
  "/change-password",
  protectedRoute,
  validation(changePasswordValidation),
  catchError(changePassword)
);

/* =============== Upload User Profile Image ================ */

userRouter.post(
  "/upload-image",
  protectedRoute,
  multerHost(validationExtensions.image).single("image"),
  validation(uploadUserImageValidation),
  catchError(uploadUserImage)
);

/* ================== Grt User Account ================== */

userRouter.get("/", protectedRoute, catchError(getLoggedUserAccount));

export default userRouter;

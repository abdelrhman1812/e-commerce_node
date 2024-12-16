import { Router } from "express";
import allowedTo from "../../middleware/allowedTo.js";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import multerHost, { validationExtensions } from "../../services/multerHost.js";
import { roles } from "../../utils/enum.js";
import {
  addBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "./brand.controller.js";
import {
  addBrandValidation,
  updateBrandValidation,
} from "./brands.validation.js";

const brandRouter = Router();

brandRouter.post(
  "/",
  multerHost(validationExtensions.image).single("image"),
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(addBrandValidation),
  catchError(addBrand)
);

/* ========== Update brand ==========  */

brandRouter.put(
  "/:id",
  multerHost(validationExtensions.image).single("image"),
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(updateBrandValidation),
  catchError(updateBrand)
);

/* ========== Update brand ==========  */

brandRouter.delete(
  "/:id",
  protectedRoute,
  allowedTo(roles.ADMIN),
  catchError(deleteBrand)
);

/* ======== Get Brand  ==========  */

brandRouter.get("/:id", catchError(getBrand));

/* ======== Get All Brands  ==========  */

brandRouter.get("/", catchError(getBrands));

export default brandRouter;

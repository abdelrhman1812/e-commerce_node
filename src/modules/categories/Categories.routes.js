import { Router } from "express";
import allowedTo from "../../middleware/allowedTo.js";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import multerHost, { validationExtensions } from "../../services/multerHost.js";
import { roles } from "../../utils/enum.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "./Categories.controller.js";
import {
  addCategoryValidation,
  updateCategoryValidation,
} from "./Categories.validation.js";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  multerHost(validationExtensions.image).single("image"),
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(addCategoryValidation),
  catchError(addCategory)
);

/* ========== Update Category ==========  */

categoryRouter.put(
  "/:id",
  multerHost(validationExtensions.image).single("image"),
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(updateCategoryValidation),
  catchError(updateCategory)
);

/* ========== Delete Category ==========  */

categoryRouter.delete(
  "/:id",
  protectedRoute,
  allowedTo(roles.ADMIN),
  catchError(deleteCategory)
);

/* ========== Get Category ==========  */

categoryRouter.get("/:id", catchError(getCategory));

/* ========== Get All Categories ==========  */

categoryRouter.get("/", catchError(getAllCategories));

export default categoryRouter;

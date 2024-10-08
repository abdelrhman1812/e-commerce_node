import { Router } from "express";
import allowedTo from "../../middleware/allowedTo.js";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import multerHost, { validationExtensions } from "../../services/multerHost.js";
import { roles } from "../../utils/enum.js";
import reviewRouter from "../reviews/reviews.routes.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./products.controller.js";
import {
  addProductValidation,
  updateProductValidation,
} from "./products.validation.js";

const productRouter = Router({ mergeParams: "true" });

productRouter.use("/:productId/reviews", reviewRouter);

/* ============ Add Product ============ */

productRouter.post(
  "/",
  multerHost(validationExtensions.image).fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(addProductValidation),
  catchError(addProduct)
);

/* ============ Update Product ============ */

productRouter.put(
  "/:id",
  multerHost(validationExtensions.image).fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(updateProductValidation),
  catchError(updateProduct)
);

/* ============ Delete Product ============ */

productRouter.delete(
  "/:id",
  protectedRoute,
  allowedTo(roles.ADMIN),
  catchError(deleteProduct)
);

/* ============ Get Products ============ */

productRouter.get("/", catchError(getProducts));

/* =========== Get Product By Id ============ */

productRouter.get("/:id", catchError(getProduct));

export default productRouter;

import { Router } from "express";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import {
  addToCart,
  clearCart,
  deleteCartProduct,
  getLoggedUserCart,
  updateQuantity,
} from "./cart.controller.js";
import {
  addToCartValidation,
  updateCartValidation,
} from "./cart.validation.js";

const cartRouter = Router();

/* =========== Add Product To Cart ============ */

cartRouter.post(
  "/",
  protectedRoute,
  validation(addToCartValidation),
  addToCart
);

/* ========== Update Product Quantity ============ */

cartRouter.put(
  "/:id",
  protectedRoute,
  validation(updateCartValidation),
  updateQuantity
);

/* ========== Delete Product From Cart ============ */

cartRouter.delete("/:id", protectedRoute, deleteCartProduct);

//* ========== Get User Cart ============ */

cartRouter.put("/", protectedRoute, clearCart);

/* ========== Get User Cart ============ */

cartRouter.get("/", protectedRoute, getLoggedUserCart);

export default cartRouter;

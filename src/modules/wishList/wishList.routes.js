import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";

import {
  addToWishlist,
  clearLoggedUserWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishList,
} from "./wishList.controller.js";
import { addToWishListValidation } from "./wishlist.validation.js";

const wishListRouter = Router();

/* =========== Add Product To WishList ============ */

wishListRouter.post(
  "/",
  protectedRoute,
  validation(addToWishListValidation),
  catchError(addToWishlist)
);

/* ========== Delete Product From WishList ============ */

wishListRouter.delete(
  "/:id",
  protectedRoute,
  catchError(deleteProductFromWishlist)
);

/* ========== Clear User WishList ============ */

wishListRouter.put("/", protectedRoute, catchError(clearLoggedUserWishlist));

/* ========== Get User WishList ============ */

wishListRouter.get("/", protectedRoute, getLoggedUserWishList);

export default wishListRouter;

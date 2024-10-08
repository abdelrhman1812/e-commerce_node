import { Router } from "express";
import allowedTo from "../../middleware/allowedTo.js";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import { roles } from "../../utils/enum.js";
import {
  addCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "./coupons.controller.js";
import {
  addCouponValidation,
  updateCouponValidation,
} from "./coupons.validation.js";

const couponsRouter = Router();

/* =========== Add Coupon =========== */

couponsRouter.post(
  "/",
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(addCouponValidation),
  catchError(addCoupon)
);

/* ========== Update Coupon =========== */

couponsRouter.put(
  "/:id",
  protectedRoute,
  allowedTo(roles.ADMIN),
  validation(updateCouponValidation),
  catchError(updateCoupon)
);

/* ========== Delete Coupon =========== */

couponsRouter.delete(
  "/:id",
  protectedRoute,
  allowedTo(roles.ADMIN),
  catchError(deleteCoupon)
);

/* ========== Get Coupons =========== */
couponsRouter.get(
  "/",
  protectedRoute,
  allowedTo(roles.ADMIN),
  catchError(getCoupons)
);

/* ========== Get Coupon =========== */
couponsRouter.get(
  "/:id",
  protectedRoute,
  allowedTo(roles.ADMIN),
  catchError(getCoupon)
);

export default couponsRouter;

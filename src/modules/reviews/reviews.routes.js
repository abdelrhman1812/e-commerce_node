import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import {
  addReview,
  deleteReview,
  getReview,
  getReviews,
} from "./reviews.controller.js";
import { addReviewValidation } from "./reviews.validation.js";

const reviewRouter = Router({ mergeParams: true });

/* ======== Add Review ======== */

reviewRouter.post(
  "/",
  protectedRoute,
  validation(addReviewValidation),
  catchError(addReview)
);

/* ======== Delete Review ======== */

reviewRouter.delete("/:id", protectedRoute, catchError(deleteReview));

/* ======== Get Reviews ======== */

reviewRouter.get("/", catchError(getReviews));

/* ======== Get Review ======== */

reviewRouter.get("/:id", catchError(getReview));

export default reviewRouter;

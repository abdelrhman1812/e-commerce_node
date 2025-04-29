import { Router } from "express";
import catchError from "../../middleware/catchError.js";
import protectedRoute from "../../middleware/protectedRoutes.js";
import { validation } from "../../middleware/validation.js";
import {
  createCashOrder,
  deleteOrder,
  getLoggedUserOrders,
} from "./order.controller.js";
import orderValidation from "./orders.validation.js";

const orderRouter = Router();

/* ============= Create Order ============= */

orderRouter.post(
  "/:id",
  protectedRoute,
  validation(orderValidation),
  catchError(createCashOrder)
);

/* ============ Get Logged User Orders ============ */

orderRouter.get("/", protectedRoute, catchError(getLoggedUserOrders));

/* =========== Delete Order ============ */

orderRouter.delete("/:id", protectedRoute, catchError(deleteOrder));

export default orderRouter;

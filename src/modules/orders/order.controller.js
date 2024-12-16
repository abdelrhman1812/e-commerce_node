import CartModel from "../../../database/models/cart.model.js";
import OrderModel from "../../../database/models/order.model.js";
import ProductModel from "../../../database/models/product.model.js";
import AppError from "../../utils/appError.js";
import { messages } from "../../utils/messages.js";

/* =========== Create Cash Order ============ */

const createCashOrder = async (req, res, next) => {
  const userId = req.user._id;
  const cartId = req.params.id;

  const { shoppingAddress } = req.body;

  /* Get Cart and Check Exist */
  const cart = await CartModel.findById(cartId);
  if (!cart) return next(new AppError(messages.cart.notFound, 404));

  if (cart.products.length <= 0) {
    return next(new AppError(messages.cart.empty, 400));
  }

  /* Get Total Price */
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  /* Check Stock of each product */

  for (let cartProduct of cart.products) {
    const product = await ProductModel.findById(cartProduct.productId);
    if (!product) {
      return next(new AppError(`${cartProduct.productId} not found`, 404));
    }

    if (product.stock < cartProduct.quantity) {
      return next(
        new AppError(
          `Product "${product.title}" is out of stock. Only ${product.stock} units available.`,
          400
        )
      );
    }
  }

  /* Create Order */

  let order = new OrderModel({
    user: userId,
    orderItems: cart.products,
    totalOrderPrice,
    shoppingAddress,
  });

  await order.save();

  /* increment product sold and decrement product stock */

  /*  this is make many  requests  */

  //   cart.products.forEach(async (item) => {
  //     await ProductModel.findByIdAndUpdate(item.productId, {
  //       $inc: { sold: item.quantity, stock: -item.quantity },
  //     });
  //   });

  /* Best way */

  let options = cart.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product.productId },
        update: { $inc: { sold: product.quantity, stock: -product.quantity } },
      },
    };
  });

  ProductModel.bulkWrite(options);

  /* clear cart */
  await CartModel.findByIdAndUpdate(cartId, {
    $set: { products: [], totalCartPrice: 0, totalCartPriceAfterDiscount: 0 },
  });

  return res.json({
    message: messages.order.successCreate,
    order,
    success: true,
  });
};

/* =========== Get Logged User Orders ============ */

const getLoggedUserOrders = async (req, res, next) => {
  const userId = req.user._id;

  const orders = await OrderModel.find({ user: userId }).populate(
    "orderItems.productId"
  );

  return res.json({
    message: messages.order.successGet,
    orders,
    success: true,
  });
};

/* =========== Delete Order ============ */

const deleteOrder = async (req, res, next) => {
  const orderId = req.params.id;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(new AppError(messages.order.notFound, 404));
  }

  await OrderModel.findByIdAndDelete(orderId);

  return res.json({
    message: messages.order.successDelete,
    success: true,
  });
};

export { createCashOrder, deleteOrder, getLoggedUserOrders };

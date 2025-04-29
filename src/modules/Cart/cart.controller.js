import CartModel from "../../../database/models/cart.model.js";
import ProductModel from "../../../database/models/product.model.js";
import AppError from "../../utils/appError.js";
import { messages } from "../../utils/messages.js";

/*

- productId == exist or no
- quantity == Stock or no
- user == exist or no
- cart == exist or no
 */

const calcTotalPrice = (cart) => {
  cart.totalCartPrice = cart.products.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0
  );
};

/* =============== Add To Cart ===============  */

const addToCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;

  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  if (product.stock < quantity) {
    return next(new AppError(messages.product.outOfStock, 400));
  }

  const cartIsExist = await CartModel.findOne({ user: userId });

  /* Create Cart If Not Exist */
  if (!cartIsExist) {
    const cart = new CartModel({
      user: userId,
      products: [
        {
          productId,
          quantity,
          price: product.price,
        },
      ],
    });
    calcTotalPrice(cart);
    await cart.save();
    return res.json({
      message: messages.cart.success,
      cart,
      success: true,
    });
  }

  let flag = false;

  /* Update Cart If Exist */
  for (let cartProduct of cartIsExist.products) {
    if (cartProduct.productId.toString() === productId) {
      const newQuantity = cartProduct.quantity + (quantity || 1);
      // if (product.stock < newQuantity) {
      //   return next(new AppError(messages.product.outOfStock, 400));
      // }
      cartProduct.quantity = newQuantity;
      flag = true;
    }
  }

  /* Create Product If Not Exist */
  if (!flag) {
    cartIsExist.products.push({
      productId,
      quantity: quantity || 1,
      price: product.price,
    });
  }

  /* Recalculate totalCartPrice */

  calcTotalPrice(cartIsExist);

  await cartIsExist.save();

  return res.json({
    message: messages.cart.success,
    cart: cartIsExist,
    success: true,
  });
};

/* ============ Update Quantity ============ */

const updateQuantity = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;
  const { quantity } = req.body;

  /* Check if user has cart */
  const cart = await CartModel.findOne({ user: userId });
  if (!cart) {
    return next(new AppError(messages.cart.notFound, 404));
  }

  /* Check if product  */
  const product = await ProductModel.findOne({ _id: productId });
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  /* Check if product is in cart */
  const cartProduct = cart.products.find(
    (item) => item.productId.toString() === productId
  );
  if (!cartProduct) {
    return next(new AppError(messages.product.notInCart, 404));
  }

  /* Check if quantity is valid */
  const newQuantity = quantity;
  if (newQuantity <= 0) {
    return next(new AppError(messages.cart.invalidQuantity, 400));
  }

  // /* Check if stock is valid */
  // if (product.stock < newQuantity) {
  //   return next(new AppError(messages.product.outOfStock, 400));
  // }

  /* Update quantity */
  cartProduct.quantity = newQuantity;

  /* Recalculate totalCartPrice */
  calcTotalPrice(cart);

  await cart.save();

  const cartItems = await CartModel.findOne({ user: userId }).populate(
    "products.productId"
  );

  return res.json({ message: messages.cart.updatedSuccess, cart: cartItems });
};

/* ============ Delete Product from Cart ============ */

// const deleteCartProduct = async (req, res, next) => {
//   const userId = req.user._id;
//   const productId = req.params.id;

//   const cart = await CartModel.findOneAndUpdate(
//     { user: userId },
//     { $pull: { products: { productId: productId } } },
//     { new: true }
//   );

//   if (!cart) {
//     return next(new AppError(messages.cart.notFound, 404));
//   }
//   /* Recalculate totalCartPrice */
//   calcTotalPrice(cart);

//   await cart.save();

//   return res.json({ message: messages.cart.updatedSuccess, cart });
// };

const deleteCartProduct = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;

  /* Check if the cart exists */
  let cart = await CartModel.findOne({ user: userId });
  if (!cart) {
    return next(new AppError(messages.cart.notFound, 404));
  }

  /* Check if the product exists in the cart */
  const productInCart = cart.products.find(
    (item) => item.productId.toString() === productId
  );
  if (!productInCart) {
    return next(new AppError(messages.product.notInCart, 404));
  }

  /* Remove product from cart */
  cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { $pull: { products: { productId: productId } } },
    { new: true }
  );

  /* Check if the cart is empty after removal */
  if (cart.products.length === 0) {
    cart.totalCartPrice = 0;
  } else {
    /* Recalculate totalCartPrice */
    calcTotalPrice(cart);
  }

  /* Save the updated cart */
  await cart.save();

  const cartItems = await CartModel.findOne({ user: userId }).populate(
    "products.productId"
  );

  return res.json({ message: messages.cart.updatedSuccess, cart: cartItems });
};

/* ============ Clear Cart ============ */

const clearCart = async (req, res, next) => {
  const userId = req.user._id;
  const cart = await CartModel.findOneAndUpdate(
    { user: userId },
    { $set: { products: [], totalCartPrice: 0 } },
    { new: true }
  );
  if (!cart) {
    return next(new AppError(messages.cart.notFound, 404));
  }

  const cartItems = await CartModel.findOne({ user: userId }).populate(
    "products.productId"
  );
  return res.json({ message: messages.cart.success, cart: cartItems });
};

/* =========== Get User Cart ============ */

const getLoggedUserCart = async (req, res, next) => {
  const userId = req.user._id;
  const cart = await CartModel.findOne({ user: userId }).populate(
    "products.productId"
  );

  const count = cart.products.length;
  if (!cart) {
    return next(new AppError(messages.cart.notFound, 404));
  }

  return res.json({ message: messages.cart.success, count, cart });
};

export {
  addToCart,
  clearCart,
  deleteCartProduct,
  getLoggedUserCart,
  updateQuantity,
};

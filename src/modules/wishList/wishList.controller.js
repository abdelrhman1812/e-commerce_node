import ProductModel from "../../../database/models/product.model.js";
import wishListModel from "../../../database/models/wishList.model.js";
import AppError from "../../utils/appError.js";
import { messages } from "../../utils/messages.js";

/* =============== Create WishList ===============  */

const addToWishlist = async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;

  /* Check if product exists */
  const product = await ProductModel.findById({ _id: productId });
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  /* Find or create wishlist */
  let wishlist = await wishListModel.findOne({ user: userId });
  if (!wishlist) {
    wishlist = new wishListModel({
      user: userId,
      products: [productId],
      active: true,
    });
    await wishlist.save();
    return res.json({
      message: messages.wishlist.success,
      wishlist,
      success: true,
    });
  }

  /* Add product to wishlist */
  await wishListModel.updateOne(
    { user: userId },
    { $addToSet: { products: productId } }
  );

  wishlist = await wishListModel.findOne({ user: userId }).populate("products");

  return res.json({
    message: messages.wishlist.successAdd,
    wishlist,
    success: true,
  });
};

/* =============== Delete Product From WishList ===============  */

const deleteProductFromWishlist = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;

  /* Find wishlist */
  let wishlist = await wishListModel.findOne({ user: userId });
  if (!wishlist) {
    return next(new AppError(messages.wishlist.notFound, 404));
  }

  /* Remove product from wishlist */
  await wishListModel.updateOne(
    { user: userId },
    { $pull: { products: productId } }
  );

  wishlist = await wishListModel.findOne({ user: userId }).populate("products");

  return res.json({
    message: messages.wishlist.successDelete,
    wishlist,
    success: true,
  });
};

/* =============== Clear Logged User WishList ===============  */

const clearLoggedUserWishlist = async (req, res, next) => {
  const userId = req.user._id;

  await wishListModel.updateOne({ user: userId }, { $set: { products: [] } });

  const wishlist = await wishListModel.findOne({ user: userId });

  return res.json({
    message: messages.wishlist.successClear,
    wishlist,
    success: true,
  });
};

/* =============== Get Logged User WishList ===============  */

const getLoggedUserWishList = async (req, res, next) => {
  const userId = req.user._id;

  const wishlist = await wishListModel
    .findOne({ user: userId })
    .populate("products");

  if (!wishlist) {
    return res.json({
      message: messages.wishlist.notFound,
      wishlist: {
        user: userId,
        products: [],
      },
      success: true,
    });
  }

  const count = await wishlist.products.length;
  return res.json({
    message: messages.wishlist.success,
    count,
    wishlist,
    success: true,
  });
};

export {
  addToWishlist,
  clearLoggedUserWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishList,
};

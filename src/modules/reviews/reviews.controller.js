import OrderModel from "../../../database/models/order.model.js";
import ProductModel from "../../../database/models/product.model.js";
import ReviewModel from "../../../database/models/review.model.js";
import AppError from "../../utils/appError.js";
import { messages } from "../../utils/messages.js";

/* ============== Add Review ==============  */

const addReview = async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  const { comment, rate } = req.body;

  const product = await ProductModel.findById(productId);
  if (!product) return next(new AppError(messages.product.notFound, 404));

  const reviewExist = await ReviewModel.findOne({
    createdBy: userId,
    productId,
  });
  if (reviewExist)
    return next(new AppError(messages.review.alreadyReviewed, 409));

  const order = await OrderModel.findOne({
    user: userId,
    "orderItems.productId": productId,
  });

  if (!order) return next(new AppError(messages.review.mustPurchase, 403));

  const review = new ReviewModel({
    comment,
    rate,
    productId,
    createdBy: userId,
  });

  await review.save();

  let sum = product.rateAvg * product.rateNum;
  sum += rate;

  product.rateAvg = sum / (product.rateNum + 1).toFixed(1);
  product.rateNum++;

  await product.save();

  res.status(201).json({
    message: messages.review.successAdd,
    review,
    success: true,
  });
};

/* ============== Delete Review ==============  */

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.id;
  const userId = req.user._id;

  // تحقق من وجود المراجعة وحذفها
  const reviewIsExist = await ReviewModel.findOneAndDelete({
    _id: reviewId,
    createdBy: userId,
  });

  if (!reviewIsExist) {
    return next(new AppError(messages.review.reviewIsNotExist, 404));
  }

  // تحقق من وجود المنتج
  const product = await ProductModel.findById(reviewIsExist.productId);
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  // احسب متوسط التقييم الجديد
  let sum = product.rateAvg * product.rateNum;
  sum -= reviewIsExist.rate;

  // تحديث متوسط التقييم وعدد التقييمات
  product.rateAvg = (sum / (product.rateNum - 1)).toFixed(1);
  product.rateNum--;

  // احفظ التغييرات في المنتج
  await product.save();

  // رد بنجاح
  res.status(200).json({
    message: messages.review.successDelete,
    success: true,
  });
};

/* ============== Get Reviews ==============  */

const getReviews = async (req, res, next) => {
  const reviews = await ReviewModel.find()
    .populate("productId", " title imageCover")
    .populate("createdBy", "profile name");
  return res.status(200).json({
    message: messages.review.getReview,
    reviews,
    success: true,
  });
};

/* Get Reviews */

const getReview = async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await ReviewModel.findById(reviewId)
    .populate("productId", " title imageCover")
    .populate("createdBy", "profile name");
  return res.status(200).json({
    message: messages.review.getReview,
    review,
    success: true,
  });
};

export { addReview, deleteReview, getReview, getReviews };

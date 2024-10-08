import CouponModel from "../../../database/models/coupon.model.js";
import { messages } from "../../utils/messages.js";

/* ======== Add Coupon =========  */
const addCoupon = async (req, res) => {
  const adminId = req.user._id;
  const { code, amount, fromDate, toDate } = req.body;

  const codeExist = await CouponModel.findOne({ code: code.toLowerCase() });
  if (codeExist) {
    return res.json({ message: "Coupon already exist", success: false });
  }

  const coupon = new CouponModel({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: adminId,
  });
  await coupon.save();

  return res.json({ message: messages.coupon.success, coupon, success: true });
};

/* ======== Update Coupon =========  */

const updateCoupon = async (req, res) => {
  const adminId = req.user._id;
  const couponId = req.params.id;
  const { code, amount, fromDate, toDate } = req.body;

  // Check If Coupon Exists
  const coupon = await CouponModel.findById(couponId);
  if (!coupon) {
    return res.json({ message: messages.coupon.notFound, success: false });
  }

  // Check If User Is Authorized
  if (adminId.toString() !== coupon.createdBy.toString()) {
    return res.json({ message: messages.user.notAuthorized, success: false });
  }

  // Check If Coupon Code Already Exists for Other Coupons
  const couponIsExist = await CouponModel.findOne({
    code,
    _id: { $ne: couponId },
  });
  if (couponIsExist) {
    return res.json({ message: messages.coupon.isExist, success: false });
  }

  // Update Coupon
  const updatedCoupon = await CouponModel.findByIdAndUpdate(
    couponId,
    {
      code,
      amount,
      fromDate,
      toDate,
    },
    { new: true }
  );

  return res.json({
    message: messages.coupon.success,
    updatedCoupon,
    success: true,
  });
};

/* ======== Delete Coupon =========  */

const deleteCoupon = async (req, res) => {
  const couponId = req.params.id;
  const coupon = await CouponModel.findById(couponId);
  if (!coupon) {
    return res.json({ message: messages.coupon.notFound, success: false });
  }

  await CouponModel.findByIdAndDelete(couponId);
  return res.json({ message: messages.coupon.success, success: true });
};

/* ======== Get Coupons =========  */
const getCoupons = async (req, res) => {
  const coupons = await CouponModel.find();
  return res.json({ message: messages.coupon.success, coupons, success: true });
};

/* ======== Get Coupons =========  */

const getCoupon = async (req, res) => {
  const couponId = req.params.id;

  const coupon = await CouponModel.findById(req.params.id);
  return res.json({ message: messages.coupon.success, coupon, success: true });
};

export { addCoupon, deleteCoupon, getCoupon, getCoupons, updateCoupon };

import { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "code is required"],
      unique: [true, "code must be unique"],
      minLength: [3, "short code"],
      maxLength: [10, "long code"],
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      min: [1, "min discount is 1"],
      max: [99, "max discount is 99"],
    },

    useBy: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    fromDate: {
      type: Date,
      required: [true, "fromDate is required"],
    },
    toDate: {
      type: Date,
      required: [true, "toDate is required"],
    },
  },

  { timestamps: true, versionKey: false }
);

const CouponModel = model("Coupon", couponSchema);

export default CouponModel;

import { model, Schema, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
      minLength: [3, "Comment is too short"],
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [1, "Minimum rate is 1"],
      max: [5, "Maximum rate is 5"],
    },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ReviewModel = model("Review", reviewSchema);

export default ReviewModel;

import { model, Schema, Types } from "mongoose";

const wishListSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    active: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true, versionKey: false }
);

const wishListModel = model("WishList", wishListSchema);

export default wishListModel;

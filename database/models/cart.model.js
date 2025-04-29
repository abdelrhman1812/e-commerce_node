import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          //   min: [1, "min quantity is 1"],
        },
        price: {
          type: Number,
        },
      },
    ],

    totalCartPrice: {
      type: Number,
    },
    totalCartPriceAfterDiscount: {
      type: Number,
    },
  },

  { timestamps: true, versionKey: false }
);

const CartModel = model("Cart", cartSchema);

export default CartModel;

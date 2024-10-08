import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: 60,
      lowercase: true,
      trim: true,
      required: true,
      minLength: [2, "short product title"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    /* Price */
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    priceAfterDiscount: {
      type: Number,
      default: 1,
    },
    /* Other */
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    imageCover: {
      secure_url: String,
      public_id: String,
    },
    images: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    customId: {
      type: String,
    },
    stock: {
      type: Number,
      default: 1,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    rateNum: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const ProductModel = model("Product", productSchema);

export default ProductModel;

import { model, Schema, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "name is unique and required"],
      minLength: 2,
      maxLength: 30,
      trim: true,
      lowercase: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "slug is unique and required"],
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    customId: String,

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const BrandModel = model("Brand", brandSchema);

export default BrandModel;

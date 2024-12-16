import { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      lowercase: true,
      required: true,
      unique: [true, "name is unique and required"],
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 30,
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

const CategoryModel = model("Category", categorySchema);

export default CategoryModel;

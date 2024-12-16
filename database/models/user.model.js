import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/enum.js";
import { hashPassword } from "../../src/utils/hashAndCompare.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [2, "short name"],
      maxLength: [15, "long name"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "email is required"],
      unique: [true, "email must be unique and required"],
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },

    status: {
      type: String,
      enum: Object.values(status),
      default: status.OFFLINE,
    },
    profile: {
      secure_url: String,
      public_id: String,
    },
    code: {
      type: String,
    },
    customId: String,
    passwordChangedAt: Date,
  },
  { timestamps: true, versionKey: false }
);

/* ============= Hash Password ============= */

userSchema.pre("save", function () {
  this.password = hashPassword({ plaintext: this.password });
}),
  userSchema.pre("findOneAndUpdate", function () {
    if (this._update.password)
      this._update.password = hashPassword({
        plaintext: this._update.password,
      });
  });

const UserModel = model("User", userSchema);

export default UserModel;

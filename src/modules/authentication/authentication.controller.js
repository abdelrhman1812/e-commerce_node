import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid/non-secure";
import UserModel from "../../../database/models/user.model.js";
import sendEmails from "../../services/email.js";
import AppError from "../../utils/appError.js";
import { status } from "../../utils/enum.js";
import { comparePassword } from "../../utils/hashAndCompare.js";
import { messages } from "../../utils/messages.js";

/* =============================== Register =============================== */
const register = async (req, res, next) => {
  const { name, email, password, confirmPassword, phone, address } = req.body;

  /* Check If User Exist */
  const isExist = await UserModel.findOne({ email: email.toLowerCase() });
  // isExist && next(new AppError(messages.email.isExist, 409));

  if (isExist) return next(new AppError(messages.email.isExist, 409));
  /* Create User */
  const user = new UserModel({
    name,
    email: email.toLowerCase(),
    password,
    confirmPassword,
    phone,
    address,
  });

  const createdUser = await user.save();

  return res.status(200).json({
    message: messages.user.successCreate,
    user: createdUser,
    success: true,
  });
};

/* =============================== Login =============================== */

const login = async (req, res, next) => {
  const { email, password } = req.body;

  /* Check If User Exist */
  let userExist = await UserModel.findOne({ email });
  if (!userExist) return next(new AppError(messages.email.isNotExist, 404));

  /* Compare Password */
  const matchPassword = comparePassword({
    plaintext: password,
    hashValue: userExist.password,
  });

  if (!matchPassword)
    return next(new AppError(messages.password.incorrect, 401));

  /* Update User Status to Online */
  const user = await UserModel.updateOne(
    { _id: userExist._id },
    { status: status.ONLINE },
    { new: true }
  );
  userExist.password = undefined;

  /* Generate Token */
  const token = jwt.sign(
    {
      userId: userExist._id,
      name: userExist.username,
      email: userExist.email,
      role: userExist.role,
    },
    process.env.JWT_SECRET,
    // { expiresIn: '1h' },
    (err, token) => {
      if (err) return next(new AppError("Token generation failed", 500));
      return res.status(200).json({
        message: messages.user.login,
        token,
        user: userExist,
        success: true,
      });
    }
  );
};

/* =============================== Forget Password ===============================  */

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  /* Check If User Exist */
  const user = await UserModel.findOne({ email });
  if (!user) return next(new AppError(messages.email.isNotExist, 404)); // إذا لم يتم العثور على المستخدم

  /* Generate New Code */
  const code = customAlphabet("1234567890", 6);
  const newCode = code();

  /* Send Email */
  await sendEmails(
    email,
    "Forget Password",
    `<h1>Your code is ${newCode}</h1>`,
    res
  );

  /* Update User Code */
  await UserModel.updateOne({ _id: user._id }, { code: newCode });

  res.json({ message: messages.user.success, success: true });
};

/* =============================== Reset Password ===============================  */

const resetPassword = async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  /* Check If User Exist */
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) return next(new AppError(messages.email.isNotExist, 404));

  /* Compare Code */
  if (user.code !== code) return next(new AppError(messages.code.invalid, 401));

  /* Change Password */

  user.password = newPassword;
  user.code = "";

  /* Update User Password */

  await user.save();

  res.json({ message: messages.user.success, success: true });
};

export { forgotPassword, login, register, resetPassword };

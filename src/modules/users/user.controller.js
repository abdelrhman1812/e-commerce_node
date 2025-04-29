import { nanoid } from "nanoid";
import UserModel from "../../../database/models/user.model.js";
import { destroyImage, uploadCoverImage } from "../../services/uploadImages.js";
import AppError from "../../utils/appError.js";
import { comparePassword } from "../../utils/hashAndCompare.js";
import { messages } from "../../utils/messages.js";

/* ================ Update User account ================ */

const updateUserAccount = async (req, res, next) => {
  const userId = req.user._id;

  const { email, name, phone, address } = req.body;

  /* Check If Email Exist */
  const emailIsExist = await UserModel.findOne({
    email: email.toLowerCase(),
    _id: { $ne: userId },
  });
  if (emailIsExist) {
    return next(new AppError(messages.email.isExist, 409));
  }

  /* Find User and Update */
  const user = await UserModel.findOneAndUpdate(
    { _id: userId },
    { email, name, phone, address },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError(messages.user.notFound, 404));
  }

  res.status(200).json({
    message: messages.user.success,
    success: true,
    user,
  });
};

/* ================ Change Password ================ */

const changePassword = async (req, res, next) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  /* Check If User Exist */
  const user = await UserModel.findById(userId);
  if (!user) return next(new AppError(messages.user.notFound, 404));

  /* Check Password Match */

  if (
    !comparePassword({ plaintext: currentPassword, hashValue: user.password })
  ) {
    return next(new AppError(messages.password.incorrect, 401));
  }

  /* Update Password */
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: messages.password.changePasswordSuccess,
    success: true,
    user,
  });
};

/* ================ Update User Profile Image ================ */

const uploadUserImage = async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);

  const user = await UserModel.findById(userId);
  if (user.profile && user.profile.public_id) {
    await destroyImage(user.profile.public_id);
  }

  let path;
  if (user.customId && user.customId !== "") {
    path = user.customId;
  } else {
    const customId = nanoid(5);
    user.customId = customId;
    path = user.customId;
    await user.save();
  }
  const folderPath = `Depi/E-commerce/users/Images/${path}`;

  const image = await uploadCoverImage(req.file, folderPath);

  let updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { profile: { secure_url: image.secure_url, public_id: image.public_id } },
    { new: true }
  );

  res.status(200).json({
    message: messages.user.successUpdateProfileImage,
    success: true,
    user: updatedUser,
  });
};

/* ================ Get User ================ */

const getLoggedUserAccount = async (req, res, next) => {
  const userId = req.user._id;
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    return next(new AppError(messages.user.notFound, 404));
  }
  res.status(200).json({
    message: messages.user.success,
    success: true,
    user,
  });
};

export {
  changePassword,
  getLoggedUserAccount,
  updateUserAccount,
  uploadUserImage,
};

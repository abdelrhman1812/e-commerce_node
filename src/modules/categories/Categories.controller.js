import { nanoid } from "nanoid";
import slugify from "slugify";
import CategoryModel from "../../../database/models/category.model.js";
import { destroyImage, uploadCoverImage } from "../../services/uploadImages.js";
import AppError from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { messages } from "../../utils/messages.js";

/* ==========  Add Category ==========  */

const addCategory = async (req, res, next) => {
  const admin = req.user;

  const { name } = req.body;
  const slug = slugify(name);

  /* Check Category  */

  const categoryIsExist = await CategoryModel.findOne({
    $or: [{ name: name.toLowerCase() }, { slug: slug.toLowerCase() }],
  });
  if (categoryIsExist)
    return next(new AppError(messages.category.isExist, 409));

  /* Check File */

  if (!req.file) {
    return next(new AppError(messages.file.noFileUpload, 404));
  }

  const customId = nanoid(5);

  const folderPath = `Depi/E-commerce/Categories/Images/${customId}`;
  const image = await uploadCoverImage(req.file, folderPath);

  /*  Prepare Category */

  let category = new CategoryModel({
    name,
    slug,
    image: { secure_url: image.secure_url, public_id: image.public_id },
    customId,
    createdBy: admin._id,
  });
  await category.save();

  return res
    .status(201)
    .json({ message: messages.category.successAdd, category, success: true });
};

/* ==========  Update Category ==========  */
const updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const adminId = req.user._id;

  const category = await CategoryModel.findById(categoryId);
  if (!category) return next(new AppError(messages.category.notFound, 404));

  if (adminId.toString() !== category.createdBy.toString()) {
    return next(new AppError(messages.user.notAuthorized, 403));
  }

  if (name) {
    const categoryIsExist = await CategoryModel.findOne({
      name: name.toLowerCase(),
      _id: { $ne: categoryId },
    });

    if (categoryIsExist)
      return next(new AppError(messages.category.isExist, 409));
    category.name = name.toLowerCase();
    category.slug = slugify(name);
  }

  if (req.file) {
    const folderPath = `Depi/E-commerce/Categories/Images/${category.customId}`;
    await destroyImage(category.image.public_id);
    const { secure_url, public_id } = await uploadCoverImage(
      req.file,
      folderPath
    );

    category.image = { secure_url, public_id };
  }

  await category.save();

  return res.json({ message: messages.category.successUpdate, category });
};

/* ==========  Delete Category ==========  */

const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  const adminId = req.user._id;

  const category = await CategoryModel.findById(categoryId);
  if (!category) return next(new AppError(messages.category.notFound, 404));

  if (adminId.toString() !== category.createdBy.toString()) {
    return next(new AppError(messages.user.notAuthorized, 403));
  }

  if (category.image && category.image.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }
  const folderPath = `Depi/E-commerce/Categories/Images/${category.customId}`;
  await cloudinary.api.delete_folder(folderPath);

  await CategoryModel.findByIdAndDelete(categoryId);

  return res.json({ message: messages.category.successDelete });
};

/* ==========  Get Category ==========  */

const getCategory = async (req, res, next) => {
  const categoryId = req.params.id;

  const category = await CategoryModel.findById(categoryId);
  if (!category) return next(new AppError(messages.category.notFound, 404));

  return res.json({
    message: messages.category.success,
    category,
    success: true,
  });
};

/* ==========  Get All Categories ==========  */

const getAllCategories = async (req, res, next) => {
  const categories = await CategoryModel.find();

  return res.json({
    message: messages.category.success,
    categories,
    success: true,
  });
};

export {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
};

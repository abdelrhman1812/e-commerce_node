import { nanoid } from "nanoid";
import slugify from "slugify";
import BrandModel from "../../../database/models/brand.model.js";
import { destroyImage, uploadCoverImage } from "../../services/uploadImages.js";
import AppError from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { messages } from "../../utils/messages.js";

/* ==========  Add brand ==========  */

const addBrand = async (req, res, next) => {
  const admin = req.user;

  const { name } = req.body;
  const slug = slugify(name);

  /* Check brand  */

  const brandIsExist = await BrandModel.findOne({
    $or: [{ name: name.toLowerCase() }, { slug: slug.toLowerCase() }],
  });
  if (brandIsExist) return next(new AppError(messages.brand.isExist, 409));

  /* Check File */

  if (!req.file) {
    return next(new AppError(messages.file.noFileUpload, 404));
  }

  const customId = nanoid(5);

  const folderPath = `Depi/E-commerce/brands/Images/${customId}`;
  const image = await uploadCoverImage(req.file, folderPath);

  /*  Prepare brand */

  let brand = new BrandModel({
    name,
    slug,
    image: { secure_url: image.secure_url, public_id: image.public_id },
    customId,
    createdBy: admin._id,
  });
  await brand.save();

  return res
    .status(201)
    .json({ message: messages.brand.successAdd, brand, success: true });
};

/* ==========  Update brand ==========  */
const updateBrand = async (req, res, next) => {
  const brandId = req.params.id;
  const { name } = req.body;

  const adminId = req.user._id;

  const brand = await BrandModel.findById(brandId);
  if (!brand) return next(new AppError(messages.brand.notFound, 404));

  if (adminId.toString() !== brand.createdBy.toString()) {
    return next(new AppError(messages.user.notAuthorized, 403));
  }

  if (name) {
    const brandIsExist = await BrandModel.findOne({
      name: name.toLowerCase(),
      _id: { $ne: brandId },
    });

    if (brandIsExist) return next(new AppError(messages.brand.isExist, 409));
    brand.name = name.toLowerCase();
    brand.slug = slugify(name);
  }

  if (req.file) {
    const folderPath = `Depi/E-commerce/brands/Images/${brand.customId}`;
    await destroyImage(brand.image.public_id);
    const { secure_url, public_id } = await uploadCoverImage(
      req.file,
      folderPath
    );

    brand.image = { secure_url, public_id };
  }

  await brand.save();

  return res.json({ message: messages.brand.successUpdate, brand });
};

/* ==========  delete Brand ==========  */

const deleteBrand = async (req, res, next) => {
  const brandId = req.params.id;

  const adminId = req.user._id;

  const brand = await BrandModel.findById(brandId);
  if (!brand) return next(new AppError(messages.brand.notFound, 404));

  if (adminId.toString() !== brand.createdBy.toString()) {
    return next(new AppError(messages.user.notAuthorized, 403));
  }

  if (brand.image && brand.image.public_id) {
    await cloudinary.uploader.destroy(brand.image.public_id);
  }
  const folderPath = `Depi/E-commerce/brands/Images/${brand.customId}`;
  await cloudinary.api.delete_folder(folderPath);

  await BrandModel.findByIdAndDelete(brandId);

  return res.json({ message: messages.brand.successDelete });
};

/* ==========  Get Brand ==========  */

export const getBrand = async (req, res, next) => {
  const brandId = req.params.id;
  const brand = await BrandModel.findById(brandId);
  if (!brand) return next(new AppError(messages.brand.notFound, 404));

  return res.json({ message: messages.brand.success, brand, success: true });
};

/* ==========  Get Brand By Id ==========  */
/* ==========  Get Brand By Id //// ==========  */
/* ==========  Get Brand By Id //// ==========  */

export const getBrands = async (req, res, next) => {
  const brands = await BrandModel.find({});
  if (!brands) return next(new AppError(messages.brand.notFound, 404));
  return res.json({
    message: messages.brand.success,
    brands,
    success: true,
    msg: "success",
  });
};

export { addBrand, deleteBrand, updateBrand };

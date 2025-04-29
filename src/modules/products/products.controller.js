import { nanoid } from "nanoid";
import slugify from "slugify";
import BrandModel from "../../../database/models/brand.model.js";
import CategoryModel from "../../../database/models/category.model.js";
import ProductModel from "../../../database/models/product.model.js";
import {
  destroyImage,
  destroyImages,
  uploadCoverImage,
  uploadImages,
} from "../../services/uploadImages.js";
import ApiFeatures from "../../utils/apiFeatures.js";
import AppError from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { calculatePriceAfterDiscount } from "../../utils/helpers.js";
import { messages } from "../../utils/messages.js";

/* =============== Add Product ===============  */
const addProduct = async (req, res, next) => {
  const adminId = req.user._id;
  const { title, description, price, category, brand, stock, discount } =
    req.body;

  // Check Category If Exists
  const categoryIsExist = await CategoryModel.findById(category);
  if (!categoryIsExist)
    return next(new AppError(messages.category.notFound, 404));

  // Check Brand If Exists
  const brandIsExist = await BrandModel.findById(brand);

  if (!brandIsExist) return next(new AppError(messages.brand.notFound, 404));

  // Check If Product Exists
  const productIsExist = await ProductModel.findOne({ title });
  if (productIsExist) return next(new AppError(messages.product.isExist, 409));

  const priceAfterDiscount = price - (price * (discount || 0)) / 100;

  // Check If Files Exist
  if (!req.files || !req.files.images) {
    return next(new AppError(messages.file.noFileUpload, 404));
  }

  /* Upload Files */
  const customId = nanoid(5);
  const folderPath = `Depi/E-commerce/categories/Images/${categoryIsExist.customId}/products/${customId}`;
  const listImages = await uploadImages(req.files.images, folderPath);
  const coverImage = await uploadCoverImage(
    req.files.imageCover[0],
    folderPath
  );

  // Prepare Product Data
  let product = new ProductModel({
    title,
    slug: slugify(title),
    description,
    price,
    priceAfterDiscount,
    stock,
    discount,
    category,
    brand,
    images: listImages,
    imageCover: coverImage,
    customId,
    createdBy: adminId,
  });

  // Save product to the database
  await product.save();

  return res
    .status(201)
    .json({ message: messages.product.successAdd, product, success: true });
};

/* =============== Update Product ===============  */
const updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const adminId = req.user._id;
  const { title, description, price, category, brand, stock, discount } =
    req.body;

  let categoryCustomId;
  // Check If Product Exists

  const product = await ProductModel.findById(productId);
  if (!product) return next(new AppError(messages.product.notFound, 404));

  const categoryCustomIdDefault = await CategoryModel.findById({
    _id: product.category,
  });

  console.log("categoryCustomIdDefault", categoryCustomIdDefault.customId);

  /* Check If User Is Authorized */

  if (adminId.toString() !== product.createdBy.toString()) {
    return next(new AppError(messages.user.notAuthorized, 403));
  }

  /* Check Category If Exists */

  if (category) {
    const categoryIsExist = await CategoryModel.findById(category);
    console.log("categoryCustomId", categoryCustomId);
    categoryCustomId = categoryIsExist.customId;
    if (!categoryIsExist) {
      return next(new AppError(messages.category.notFound, 404));
    }
    product.category = category;
  }

  // Check Brand If Exists

  if (brand) {
    const brandIsExist = await BrandModel.findById(brand);
    if (!brandIsExist) return next(new AppError(messages.brand.notFound, 404));
    product.brand = brand;
  }

  // Check If Title Exists for Other Products
  if (title) {
    const productWithTitle = await ProductModel.findOne({
      title,
      _id: { $ne: productId },
    });
    if (productWithTitle) {
      return next(new AppError(messages.product.isExist, 409));
    }
    product.title = title;
    product.slug = slugify(title);
  }

  // Update price and calculate priceAfterDiscount
  if (price) {
    product.price = price;
    product.priceAfterDiscount = calculatePriceAfterDiscount(
      price,
      product.discount
    );
  }

  // Update discount and recalculate priceAfterDiscount
  if (discount !== undefined) {
    product.discount = discount;
    product.priceAfterDiscount = calculatePriceAfterDiscount(
      product.price,
      discount
    );
  }

  // Update other Fields
  if (description) product.description = description;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  /* Handling Images */
  if (req.files) {
    const folderPath = `Depi/E-commerce/categories/Images/${
      categoryCustomId || categoryCustomIdDefault.customId
    }/products/${product.customId}`;

    if (Array.isArray(req.files.images)) {
      // Delete old images
      await destroyImages(product.images);
      // Upload new images
      product.images = await uploadImages(req.files.images, folderPath);
    }

    /* Handle image cover */
    if (req.files.imageCover) {
      // Delete old image cover
      await destroyImage(product.imageCover.public_id);

      // Upload new image cover
      const coverImage = await uploadCoverImage(
        req.files.imageCover[0],
        folderPath
      );
      product.imageCover = coverImage;
    }
  }

  const updatedProduct = await product.save();

  res.status(201).json({
    message: messages.product.successUpdate,
    product: updatedProduct,
    success: true,
  });
};

/* =============== Delete Product ===============  */

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  const adminId = req.user._id;

  /* Check If Product Exists */

  const product = await ProductModel.findById(productId);
  if (!product) return next(new AppError(messages.product.notFound, 404));

  /* Check If User Is Authorized */
  if (adminId.toString() !== product.createdBy.toString()) {
    return next(new AppError(messages.user.notAuthorized, 403));
  }

  /* Get Category Path for deleting images */
  const categoryPath = await CategoryModel.findById(product.category);

  const folderPath = `Depi/E-commerce/categories/Images/${categoryPath.customId}/products/${product.customId}`;

  /* Delete Images */
  await destroyImages(product.images);
  await destroyImage(product.imageCover.public_id);

  /* Delete Folder */
  await cloudinary.api.delete_folder(folderPath);

  /* Delete Product */
  await ProductModel.findByIdAndDelete(productId);

  return res.status(200).json({
    message: messages.product.successDelete,
    success: true,
  });
};

/* =============== Get Products ===============  */

// mongoose query === model + query

const getProducts = async (req, res, next) => {
  let apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .filter()
    .search()
    .sort()
    .fields()
    .pagination();
  const products = await apiFeatures.mongooseQuery
    .populate({
      path: "reviews",
      select: "comment",
      populate: {
        path: "createdBy",
        select: "name email profile ",
      },
    })
    .populate("category", "name slug")
    .populate("brand", "name");
  const page = apiFeatures.pageNumber;
  const totalProducts = await apiFeatures.mongooseQuery
    .clone()
    .countDocuments();

  res.status(200).json({
    message: messages.product.success,
    totalProducts,
    page,
    products,
    success: true,
  });
};

/* =============== Get Product ===============  */

const getProduct = async (req, res, next) => {
  const productId = req.params.id;

  const product = await ProductModel.findById(productId)
    .populate({
      path: "reviews",
      select: "comment",
      populate: {
        path: "createdBy",
        select: "name email profile ",
      },
    })
    .populate("category", "name")
    .populate("brand", "name");

  if (!product) return next(new AppError(messages.product.notFound, 404));

  return res.status(200).json({
    message: messages.product.success,
    product,
    success: true,
  });
};

export { addProduct, deleteProduct, getProduct, getProducts, updateProduct };

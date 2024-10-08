import cloudinary from "../utils/cloudinary.js";

/* =============== Upload Images ===============  */
const uploadImages = async (images, folder) => {
  const listImages = [];

  for (const image of images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      image.path,
      {
        folder,
      }
    );
    listImages.push({ secure_url, public_id });
  }

  return listImages;
};

/* =============== Destroy Images ===============  */
const destroyImages = async (images) => {
  for (const image of images) {
    await destroyImage(image.public_id);
  }
};

/* =============== Destroy Single Image ===============  */
const destroyImage = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

/* =============== Upload Cover Image ===============  */
const uploadCoverImage = async (image, folder) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    image.path,
    {
      folder,
    }
  );
  return { secure_url, public_id };
};

export { destroyImage, destroyImages, uploadCoverImage, uploadImages };

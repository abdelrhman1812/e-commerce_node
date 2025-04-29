import multer from "multer";
import AppError from "../utils/appError.js";

/* File extensions */
export const validationExtensions = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/avif"],
  pdf: ["application/pdf"],
};

const multerHost = (customValidation = ["image/png"]) => {
  /*  Create folder if not exist && check if customPath exist to avoid undefined name folder */

  /*  Multer config */
  const storage = multer.diskStorage({});

  /* File filter */
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("File format not supported", 400), false);
    }
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};

export default multerHost;

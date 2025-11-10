import multer from "multer";
import { config } from "../config/env.config.js";
import { AppError } from "./errorHandler.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = config.upload.allowedTypes;

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
        400
      ),
      false
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
    files: 1,
  },
});

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new AppError(
          `File too large. Maximum size: ${
            config.upload.maxFileSize / 1024 / 1024
          }MB`,
          400
        )
      );
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(
        new AppError("Too many files. Upload one file at a time", 400)
      );
    }
    return next(new AppError(err.message, 400));
  }
  next(err);
};

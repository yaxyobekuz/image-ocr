import { AppError } from './errorHandler.js';

export const validateFile = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file uploaded', 400));
  }
  next();
};

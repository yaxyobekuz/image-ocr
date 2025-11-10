import ocrService from '../services/ocr.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

/**
 * Process image and extract text using OCR
 */
export const processImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { language } = req.body;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const ocrResult = await ocrService.performOCR(file.buffer, { language });

    logger.info('OCR processing completed', {
      fileName: file.originalname,
      fileSize: file.size,
      confidence: ocrResult.confidence
    });

    res.status(200).json({
      success: true,
      message: 'Image processed successfully',
      data: {
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        language: ocrResult.language,
        processingTime: ocrResult.processingTime,
        metadata: {
          originalFileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

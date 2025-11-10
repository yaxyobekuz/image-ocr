import ocrService from '../services/ocr.service.js';
import statsService from '../services/stats.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

/**
 * Process image and extract text using OCR
 */
export const processImage = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const file = req.file;
    const { language } = req.body;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const ocrResult = await ocrService.performOCR(file.buffer, { language });

    const responseTime = Date.now() - startTime;

    logger.info('OCR processing completed', {
      fileName: file.originalname,
      fileSize: file.size,
      confidence: ocrResult.confidence
    });

    statsService.recordRequest({
      endpoint: '/api/ocr/process',
      method: req.method,
      statusCode: 200,
      responseTime,
      fileSize: file.size,
      fileName: file.originalname,
      language: ocrResult.language,
      confidence: ocrResult.confidence,
      textLength: ocrResult.text.length,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      success: true,
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
    const responseTime = Date.now() - startTime;
    
    statsService.recordRequest({
      endpoint: '/api/ocr/process',
      method: req.method,
      statusCode: error.statusCode || 500,
      responseTime,
      fileSize: req.file?.size || null,
      fileName: req.file?.originalname || null,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      errorMessage: error.message,
      success: false,
    });
    
    next(error);
  }
};


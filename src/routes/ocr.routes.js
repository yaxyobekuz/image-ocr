import express from 'express';
import { processImage } from '../controllers/ocr.controller.js';
import { upload, handleMulterError } from '../middleware/upload.js';
import { validateFile } from '../middleware/validation.js';
import { ocrLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @swagger
 * /ocr/process:
 *   post:
 *     summary: Process an image and extract text using OCR
 *     tags: [OCR]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (png, jpg, jpeg, webp) - Max 10MB
 *               language:
 *                 type: string
 *                 default: eng
 *                 description: OCR language code (e.g., eng, spa, fra, deu)
 *     responses:
 *       200:
 *         description: Image processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image processed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: Extracted text from the image
 *                     confidence:
 *                       type: number
 *                       description: OCR confidence score (0-100)
 *                     language:
 *                       type: string
 *                       description: Language used for OCR
 *                     processingTime:
 *                       type: number
 *                       description: Processing time in milliseconds
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         originalFileName:
 *                           type: string
 *                         fileSize:
 *                           type: number
 *                         mimeType:
 *                           type: string
 *       400:
 *         description: Bad request - invalid file or missing file
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.post(
  '/process',
  ocrLimiter,
  upload.single('image'),
  handleMulterError,
  validateFile,
  processImage
);

export default router;

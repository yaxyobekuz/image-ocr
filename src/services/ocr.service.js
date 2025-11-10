import Tesseract from 'tesseract.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class OcrService {
  constructor() {
    this.workers = new Map();
  }

  async getWorker(language = 'eng') {
    if (!this.workers.has(language)) {
      logger.debug(`Creating new Tesseract worker for language: ${language}`);
      
      const worker = await Tesseract.createWorker(language, 1, {
        langPath: path.join(__dirname, '../../'),
        cachePath: path.join(__dirname, '../../'),
        logger: (m) => {
          if (m.status === 'recognizing text') {
            logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      this.workers.set(language, worker);
    }
    return this.workers.get(language);
  }

  async performOCR(imageBuffer, options = {}) {
    const startTime = Date.now();
    const language = options.language || 'eng';

    try {
      logger.info('Starting OCR processing', {
        language,
        bufferSize: imageBuffer.length
      });

      const worker = await this.getWorker(language);

      const {
        data: { text, confidence }
      } = await worker.recognize(imageBuffer);

      const processingTime = Date.now() - startTime;

      logger.info('OCR processing completed', {
        confidence: confidence.toFixed(2),
        processingTime,
        textLength: text.length
      });

      return {
        text: text.trim(),
        confidence: parseFloat(confidence.toFixed(2)),
        processingTime,
        language
      };
    } catch (error) {
      logger.error('OCR processing failed', {
        error: error.message,
        language
      });
      throw new AppError(`OCR processing failed: ${error.message}`, 500);
    }
  }

  async terminateWorkers() {
    logger.info('Terminating all OCR workers');
    for (const [language, worker] of this.workers.entries()) {
      await worker.terminate();
      logger.debug(`Worker terminated for language: ${language}`);
    }
    this.workers.clear();
  }
}

export default new OcrService();

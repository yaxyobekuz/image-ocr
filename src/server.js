import app from './app.js';
import { config } from './config/env.config.js';
import { logger } from './utils/logger.js';
import ocrService from './services/ocr.service.js';

const startServer = async () => {
  try {
    const server = app.listen(config.server.port, config.server.host, () => {
      logger.info(`Server running in ${config.server.env} mode`);
      logger.info(`Server listening on http://${config.server.host}:${config.server.port}`);
      logger.info(`API Documentation: http://${config.server.host}:${config.server.port}/api-docs`);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await ocrService.terminateWorkers();
          logger.info('OCR workers terminated');

          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error: error.message });
          process.exit(1);
        }
      });

      setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        reason,
        promise
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();

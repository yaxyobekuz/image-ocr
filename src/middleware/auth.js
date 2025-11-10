import { config } from '../config/env.config.js';
import { AppError } from './errorHandler.js';
import { logger } from '../utils/logger.js';

export const verifyStatsToken = (req, res, next) => {
  try {
    const token = req.headers['x-stats-token'] || req.query.token;

    if (!token) {
      logger.warn('Stats access attempted without token', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      throw new AppError('Stats token is required', 401);
    }

    if (token !== config.stats.secretToken) {
      logger.warn('Stats access attempted with invalid token', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      throw new AppError('Invalid stats token', 403);
    }

    logger.debug('Stats token verified successfully');
    next();
  } catch (error) {
    next(error);
  }
};

import statsService from '../services/stats.service.js';
import { logger } from '../utils/logger.js';

export const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate, endpoint, success } = req.query;

    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (endpoint) filters.endpoint = endpoint;
    if (success !== undefined) filters.success = success === 'true';

    const [overallStats, endpointStats, hourlyStats] = await Promise.all([
      statsService.getOverallStats(filters),
      statsService.getEndpointStats(filters),
      statsService.getHourlyStats(filters),
    ]);

    const successRate = overallStats.totalRequests > 0
      ? ((overallStats.successfulRequests / overallStats.totalRequests) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        overall: {
          ...overallStats,
          successRate: parseFloat(successRate),
        },
        byEndpoint: endpointStats,
        hourly: hourlyStats,
      },
    });
  } catch (error) {
    logger.error('Failed to get stats', { error: error.message });
    next(error);
  }
};

export const getRecentRequests = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const { startDate, endDate, endpoint, success } = req.query;

    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (endpoint) filters.endpoint = endpoint;
    if (success !== undefined) filters.success = success === 'true';

    const recentRequests = await statsService.getRecentRequests(limit, filters);

    res.status(200).json({
      success: true,
      message: 'Recent requests retrieved successfully',
      data: {
        count: recentRequests.length,
        requests: recentRequests,
      },
    });
  } catch (error) {
    logger.error('Failed to get recent requests', { error: error.message });
    next(error);
  }
};

export const deleteOldStats = async (req, res, next) => {
  try {
    const daysToKeep = parseInt(req.query.daysToKeep, 10) || 90;

    if (daysToKeep < 1) {
      return res.status(400).json({
        success: false,
        message: 'daysToKeep must be at least 1',
      });
    }

    const deletedCount = await statsService.deleteOldStats(daysToKeep);

    res.status(200).json({
      success: true,
      message: 'Old statistics deleted successfully',
      data: {
        deletedCount,
        daysKept: daysToKeep,
      },
    });
  } catch (error) {
    logger.error('Failed to delete old stats', { error: error.message });
    next(error);
  }
};

import Stats from '../models/stats.model.js';
import { logger } from '../utils/logger.js';

class StatsService {
  async recordRequest(data) {
    try {
      const stats = new Stats({
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        fileSize: data.fileSize || null,
        fileName: data.fileName || null,
        language: data.language || null,
        confidence: data.confidence || null,
        textLength: data.textLength || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        errorMessage: data.errorMessage || null,
        success: data.success,
      });

      await stats.save();
      logger.debug('Stats recorded successfully', { endpoint: data.endpoint });
    } catch (error) {
      logger.error('Failed to record stats', { error: error.message });
    }
  }

  async getOverallStats(filters = {}) {
    try {
      return await Stats.getOverallStats(filters);
    } catch (error) {
      logger.error('Failed to get overall stats', { error: error.message });
      throw error;
    }
  }

  async getEndpointStats(filters = {}) {
    try {
      return await Stats.getEndpointStats(filters);
    } catch (error) {
      logger.error('Failed to get endpoint stats', { error: error.message });
      throw error;
    }
  }

  async getHourlyStats(filters = {}) {
    try {
      return await Stats.getHourlyStats(filters);
    } catch (error) {
      logger.error('Failed to get hourly stats', { error: error.message });
      throw error;
    }
  }

  async getRecentRequests(limit = 100, filters = {}) {
    try {
      const query = {};
      
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }
      
      if (filters.endpoint) query.endpoint = filters.endpoint;
      if (filters.success !== undefined) query.success = filters.success;

      return await Stats.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('-__v')
        .lean();
    } catch (error) {
      logger.error('Failed to get recent requests', { error: error.message });
      throw error;
    }
  }

  async deleteOldStats(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await Stats.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      logger.info('Old stats deleted', {
        deletedCount: result.deletedCount,
        cutoffDate: cutoffDate.toISOString(),
      });

      return result.deletedCount;
    } catch (error) {
      logger.error('Failed to delete old stats', { error: error.message });
      throw error;
    }
  }
}

export default new StatsService();

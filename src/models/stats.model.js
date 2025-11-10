import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
    statusCode: {
      type: Number,
      required: true,
      index: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
      trim: true,
    },
    language: {
      type: String,
      default: null,
      trim: true,
    },
    confidence: {
      type: Number,
      default: null,
    },
    textLength: {
      type: Number,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },
    userAgent: {
      type: String,
      default: null,
      trim: true,
    },
    errorMessage: {
      type: String,
      default: null,
      trim: true,
    },
    success: {
      type: Boolean,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

statsSchema.index({ createdAt: 1 });
statsSchema.index({ endpoint: 1, createdAt: -1 });
statsSchema.index({ success: 1, createdAt: -1 });

statsSchema.statics.getOverallStats = async function (filters = {}) {
  const matchStage = {};
  
  if (filters.startDate || filters.endDate) {
    matchStage.createdAt = {};
    if (filters.startDate) matchStage.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) matchStage.createdAt.$lte = new Date(filters.endDate);
  }
  
  if (filters.endpoint) matchStage.endpoint = filters.endpoint;
  if (filters.success !== undefined) matchStage.success = filters.success;

  const [stats] = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        successfulRequests: {
          $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] },
        },
        failedRequests: {
          $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] },
        },
        avgResponseTime: { $avg: '$responseTime' },
        minResponseTime: { $min: '$responseTime' },
        maxResponseTime: { $max: '$responseTime' },
        avgConfidence: { $avg: '$confidence' },
        totalDataProcessed: { $sum: '$fileSize' },
      },
    },
  ]);

  return stats || {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    minResponseTime: 0,
    maxResponseTime: 0,
    avgConfidence: 0,
    totalDataProcessed: 0,
  };
};

statsSchema.statics.getEndpointStats = async function (filters = {}) {
  const matchStage = {};
  
  if (filters.startDate || filters.endDate) {
    matchStage.createdAt = {};
    if (filters.startDate) matchStage.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) matchStage.createdAt.$lte = new Date(filters.endDate);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$endpoint',
        totalRequests: { $sum: 1 },
        successfulRequests: {
          $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] },
        },
        failedRequests: {
          $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] },
        },
        avgResponseTime: { $avg: '$responseTime' },
      },
    },
    { $sort: { totalRequests: -1 } },
  ]);
};

statsSchema.statics.getHourlyStats = async function (filters = {}) {
  const matchStage = {};
  
  if (filters.startDate || filters.endDate) {
    matchStage.createdAt = {};
    if (filters.startDate) matchStage.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) matchStage.createdAt.$lte = new Date(filters.endDate);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' },
        },
        totalRequests: { $sum: 1 },
        successfulRequests: {
          $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] },
        },
        failedRequests: {
          $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1, '_id.hour': -1 } },
    { $limit: 24 },
  ]);
};

export default mongoose.model('Stats', statsSchema);

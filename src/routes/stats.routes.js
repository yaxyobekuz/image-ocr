import { Router } from 'express';
import { verifyStatsToken } from '../middleware/auth.js';
import {
  getStats,
  getRecentRequests,
  deleteOldStats,
} from '../controllers/stats.controller.js';

const router = Router();

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get overall statistics
 *     tags: [Stats]
 *     security:
 *       - StatsToken: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter stats from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter stats until this date
 *       - in: query
 *         name: endpoint
 *         schema:
 *           type: string
 *         description: Filter by specific endpoint
 *       - in: query
 *         name: success
 *         schema:
 *           type: boolean
 *         description: Filter by success status
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Stats token is required
 *       403:
 *         description: Invalid stats token
 */
router.get('/', verifyStatsToken, getStats);

/**
 * @swagger
 * /api/stats/recent:
 *   get:
 *     summary: Get recent requests
 *     tags: [Stats]
 *     security:
 *       - StatsToken: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of recent requests to retrieve
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter until this date
 *       - in: query
 *         name: endpoint
 *         schema:
 *           type: string
 *         description: Filter by endpoint
 *       - in: query
 *         name: success
 *         schema:
 *           type: boolean
 *         description: Filter by success status
 *     responses:
 *       200:
 *         description: Recent requests retrieved successfully
 *       401:
 *         description: Stats token is required
 *       403:
 *         description: Invalid stats token
 */
router.get('/recent', verifyStatsToken, getRecentRequests);

/**
 * @swagger
 * /api/stats/cleanup:
 *   delete:
 *     summary: Delete old statistics
 *     tags: [Stats]
 *     security:
 *       - StatsToken: []
 *     parameters:
 *       - in: query
 *         name: daysToKeep
 *         schema:
 *           type: integer
 *           default: 90
 *         description: Number of days to keep statistics
 *     responses:
 *       200:
 *         description: Old statistics deleted successfully
 *       400:
 *         description: Invalid daysToKeep parameter
 *       401:
 *         description: Stats token is required
 *       403:
 *         description: Invalid stats token
 */
router.delete('/cleanup', verifyStatsToken, deleteOldStats);

export default router;

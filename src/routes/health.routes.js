import express from 'express';
import statsService from '../services/stats.service.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check server health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
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
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
router.get('/health', (req, res) => {
  const startTime = Date.now();
  
  const response = {
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
  
  const responseTime = Date.now() - startTime;
  
  statsService.recordRequest({
    endpoint: '/api/health',
    method: req.method,
    statusCode: 200,
    responseTime,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    success: true,
  });
  
  res.status(200).json(response);
});

export default router;

import rateLimit from "express-rate-limit";
import { config } from "../config/env.config.js";

export const limiter = rateLimit({
  windowMs: 60000,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === "/api/health";
  },
});

export const ocrLimiter = rateLimit({
  windowMs: 60000,
  max: 20,
  message: {
    success: false,
    message: "Too many OCR requests. Maximum 20 per minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

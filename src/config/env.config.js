import dotenv from "dotenv";

dotenv.config();

export const config = {
  cors: { origin: process.env.CORS_ORIGIN || "*" },
  logging: { level: process.env.LOG_LEVEL || "info" },
  server: {
    host: process.env.HOST || "localhost",
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(",") || [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
};

export const isProduction = config.server.env === "production";
export const isDevelopment = config.server.env === "development";

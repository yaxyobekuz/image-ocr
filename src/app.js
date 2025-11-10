import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";
import { logger } from "./utils/logger.js";
import { limiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { swaggerSpec } from "./config/swagger.config.js";
import healthRoutes from "./routes/health.routes.js";
import ocrRoutes from "./routes/ocr.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

connectDB(config.mongodb.uri).catch((error) => {
  logger.error('Failed to connect to MongoDB', { error: error.message });
});

app.use(helmet());

app.use(cors({ origin: config.cors.origin, credentials: true }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const stream = {
  write: (message) => logger.info(message.trim())
};

app.use(morgan('dev', { stream }));

app.use(limiter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "OCR API Documentation",
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Image OCR API",
    version: "1.0.0",
    documentation: "/api-docs",
  });
});

app.use("/api", healthRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

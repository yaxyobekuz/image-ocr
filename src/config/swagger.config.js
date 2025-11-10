import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./env.config.js";

const options = {
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Image OCR API",
      contact: { name: "API Support", url: "https://t.me/mryaxyobek" },
      license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
      description: `Simple REST API for extracting text from images using OCR (Optical Character Recognition)`,
    },
    servers: [
      {
        description: "Production server",
        url: "https://imageocr.mysrv.uz/api",
      },
      {
        description: "Development server",
        url: `http://${config.server.host}:${config.server.port}/api`,
      },
    ],
    tags: [
      { name: "OCR", description: "OCR processing endpoints" },
      { name: "Health", description: "Health check endpoints" },
      { name: "Stats", description: "Statistics endpoints (requires token)" },
    ],
    components: {
      securitySchemes: {
        StatsToken: {
          type: "apiKey",
          in: "header",
          name: "x-stats-token",
          description: "Secret token for accessing statistics endpoints",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", description: "Error message" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object", description: "Response data" },
            message: { type: "string", description: "Success message" },
          },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc(options);

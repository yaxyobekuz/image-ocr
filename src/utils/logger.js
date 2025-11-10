import { isProduction } from "../config/env.config.js";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || "info";
  }

  log(level, message, meta = {}) {
    if (levels[level] <= levels[this.level]) {
      const timestamp = new Date().toISOString();
      const logObject = {
        timestamp,
        level: level.toUpperCase(),
        message,
        ...meta,
      };

      if (isProduction) {
        console.log(JSON.stringify(logObject));
      } else {
        console.log(
          `[${timestamp}] ${level.toUpperCase()}: ${message}`,
          Object.keys(meta).length > 0 ? meta : ""
        );
      }
    }
  }

  error(message, meta) {
    this.log("error", message, meta);
  }

  warn(message, meta) {
    this.log("warn", message, meta);
  }

  info(message, meta) {
    this.log("info", message, meta);
  }

  debug(message, meta) {
    this.log("debug", message, meta);
  }
}

export const logger = new Logger();

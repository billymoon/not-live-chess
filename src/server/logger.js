import winston from "winston";
import nextConfig from "../../next.config.js";

const {
  publicRuntimeConfig: { dev },
} = nextConfig;

const logger = winston
  .createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: dev
      ? [new winston.transports.File({ filename: "logs.ndjson" })]
      : [new winston.transports.Console({ format: winston.format.simple() })],
  })
  .child({
    logger: {
      from: "server-side",
      session: new Date() * 1,
    },
  });

export default logger;

import next from "next";
import nextConfig from "./next.config.js";
import server from "./src/server/server.js";
import logger from "./src/server/logger.js";
import { loggerSocket } from "./src/server/wss-logger-handler.js";
import winston from "winston";

const { serverRuntimeConfig, publicRuntimeConfig } = nextConfig;
const { port, wssOnly } = serverRuntimeConfig;
const { dev } = publicRuntimeConfig;

logger.stream({ start: -1 }).on("log", function (options) {
  options.logger.from !== "client-side" &&
    loggerSocket &&
    loggerSocket.send(JSON.stringify(options));
});

void (() => {
  // const consoleDebug = console.debug
  console.debug = function (...args) {
    // consoleDebug(...args);

    let options = {
      level: "info",
      message: "no message",
    };

    if (typeof args[0] === "string") {
      options.message = args[0];
    }

    if (Object.prototype.toString.call(args[0]) === "[object Object]") {
      options = { ...options, ...args[0] };
    }

    if (Object.prototype.toString.call(args[1]) === "[object Object]") {
      options = { ...options, ...args[1] };
    }

    logger.log(options);
  };
})();

if (wssOnly) {
  server({ port, wssOnly });
} else {
  const app = next({ dev });

  const requestHandler = app.getRequestHandler();

  app.prepare().then(() => {
    server({ port, requestHandler });
  });
}

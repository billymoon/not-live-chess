const { loadEnvConfig } = require("@next/env");
const index = process.argv.findIndex((x) => x === "-p" || x === "--port");
const port = index !== -1 ? process.argv[index + 1] : "3000";

const env = loadEnvConfig(".").combinedEnv;

module.exports = {
  serverRuntimeConfig: {
    port,
    dev: env.NODE_ENV !== "production",
    // run server in websocket only mode to expose board without having to reconnect when dev server restarts
    wssOnly: env.WSS_ONLY || null,
  },
  publicRuntimeConfig: {
    // specify websocket url to subscribe to board updates, useful for remote access to board, or local development without reconnecting to board each time server restarts
    websocketUrl: env.WSS_URL || null,
    lichessToken: env.LICHESS_TOKEN || null,
  },
};

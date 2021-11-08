const { loadEnvConfig } = require("@next/env");
const index = process.argv.findIndex((x) => x === "-p" || x === "--port");
const port = index !== -1 ? process.argv[index + 1] : "3000";

loadEnvConfig(".");

module.exports = {
  serverRuntimeConfig: {
    port,
    // run server in websocket only mode to expose board without having to reconnect when dev server restarts
    wssOnly: process.env.WSS_ONLY || null,
  },
  publicRuntimeConfig: {
    dev: process.env.NODE_ENV !== "production",
    // specify websocket url to subscribe to board updates, useful for remote access to board, or local development without reconnecting to board each time server restarts
    websocketUrl: process.env.WSS_URL || null,
    lichessToken: process.env.LICHESS_TOKEN || null,
    font: "Andika",
    theme: process.env.THEME || "united",
  },
};

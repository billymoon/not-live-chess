import WebSocket from "ws";
import logger from "./logger.js";

const wss = new WebSocket.Server({ noServer: true });

const session = new Date() * 1;

export let loggerSocket = null;

wss.on("connection", async function connection(ws) {
  console.debug("incoming logger connection");
  loggerSocket = ws;

  ws.on("message", async (message) => {
    try {
      // logger.log(options)
      console.debug({
        ...JSON.parse(message),
        logger: { from: "client-side", session },
      });
    } catch (err) {
      console.log(err);
    }
  });

  ws.on("close", () => {
    console.debug("logger connection closed", wss.clients.size);
  });
});

const wssHandler = (req, socket, head) =>
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });

export default wssHandler;

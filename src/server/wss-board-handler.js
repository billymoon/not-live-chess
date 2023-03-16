import WebSocket from "ws";
import { boardListener } from "./board-event-listener/board-listener.js";

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", async function connection(ws) {
  console.log("incoming connection");

  unsubscribe = await boardListener((data) => {
    ws.send(JSON.stringify(data));
  });

  // ws.on('message', async (messageRaw) => {
  //   const message = JSON.parse(messageRaw)
  // });

  ws.on("close", () => {
    console.log("connection closed", wss.clients.size);
    unsubscribe();
  });
});

const wssHandler = (req, socket, head) =>
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });

export default wssHandler;

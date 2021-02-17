const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

app.use(express.static(`${__dirname}/www`));

const server = http.createServer(app);

const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

server.on("upgrade", function (req, socket, head) {
  wss.handleUpgrade(req, socket, head, function (ws) {
    wss.emit("connection", ws, req);
  });
});

let position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

const info = () => ({
  version: "3.1",
  serialNumber: "12345",
  initialPosition: position,
  position
})

const subscribers = [];

const subscribe = (callback) => {
  if (subscribers.indexOf(callback) === -1) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(subscribers.indexOf(callback), 1);
      }
    };
  }
};

wss.on("connection", (ws, req) => {
  const jsonMessage = (data) => ws.send(JSON.stringify(data));
  ws.on("message", (rawMessage) => {
    const message = JSON.parse(rawMessage);
    position = message.position
    subscribers.forEach((subscriber) => subscriber(info()));
  });

  // // ws.on("close", function () {
  // // });
});

server.listen(1984, function () {
  console.log("Listening on http://localhost:1984");
});

const connect = async () => {
  return {
    info,
    subscribe
  }
}

module.exports = connect
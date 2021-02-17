const express = require("express");
const { Chess } = require("chess.js");
const http = require("http");
const WebSocket = require("ws");

const loggerPackage = process.env.SOCK
  ? "./dgt-logger-socket/client"
  : process.env.MOCK
  ? "./dgt-logger-mock/server"
  : "./dgt-logger";

const logger = require(loggerPackage);

const app = express();

// app.use(express.static("www"));

const server = http.createServer(app);

void (async () => {
  const { info, subscribe } = await logger();

  const wss = new WebSocket.Server({
    clientTracking: false,
    noServer: true,
  });

  server.on("upgrade", function(req, socket, head) {
    wss.handleUpgrade(req, socket, head, function(ws) {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws) => {
    const chess = new Chess();
    let gameInProgress = false;

    ws.on("message", (msgRaw) => {
      const message = JSON.parse(msgRaw);
      if (message.call === "eboards") {
        ws.send(
          JSON.stringify({
            response: "call",
            id: message.id,
            param: [
              {
                serialnr: info().serialNumber,
                state: "ACTIVE",
                board: info().position,
              },
            ],
            time: new Date() * 1,
          })
        );
      } else if (
        message.call === "subscribe" &&
        message.param.feed === "eboardevent" &&
        message.param.param.serialnr === info().serialNumber
      ) {
        ws.send(
          JSON.stringify({
            response: "call",
            id: message.id,
            param: null,
            time: new Date() * 1,
          })
        );
        ws.send(
          JSON.stringify({
            response: "feed",
            id: message.param.id,
            param: {
              serialnr: info().serialNumber,
              board: info().position,
            },
            time: new Date() * 1,
          })
        );
        subscribe(() => {
          if (
            chess
              .moves()
              .map((move) => {
                const clone = new Chess(chess.fen());
                clone.move(move);
                return clone.fen().replace(/ .*/, "");
              })
              .includes(info().position)
          ) {
            const moveIndex = chess
              .moves()
              .map((move) => {
                const clone = new Chess(chess.fen());
                clone.move(move);
                return clone.fen().replace(/ .*/, "");
              })
              .indexOf(info().position);
            const move = chess.moves()[moveIndex];
            chess.move(move);
            if (chess.game_over()) {
              chess.reset();
            }
          }
          ws.send(
            JSON.stringify({
              response: "feed",
              id: message.param.id,
              param: {
                serialnr: info().serialNumber,
                board: info().position,
                san: gameInProgress ? chess.history() : [],
              },
              time: new Date() * 1,
            })
          );
        });
      } else if (message.call === "call" && message.param.method === "setup") {
        ws.send(
          JSON.stringify({
            response: "call",
            id: message.id,
            param: null,
            time: new Date() * 1,
          })
        );
        // TODO: not sure if reset is needed
        chess.reset();
        chess.load(message.param.param.fen);
        gameInProgress = true;
        ws.send(
          JSON.stringify({
            response: "feed",
            id: 1,
            param: {
              serialnr: message.param.param.serialnr,
              board: info().position,
              start: message.param.param.fen,
              san: chess.history(),
            },
            time: new Date() * 1,
          })
        );
        console.log(chess.moves());
        console.log(chess.history());
      }
    });
  });

  server.listen(1982, () => {
    console.log("Listening on http://localhost:1982");
  });
})();

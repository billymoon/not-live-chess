import { createServer } from "http";
import { parse } from "url";
import wssBoardHandler from "./wss-board-handler.js";
import wssLoggerHandler from "./wss-logger-handler.js";

// const requestInfo = ({ url, headers, upgrade }) => ({ url, headers, upgrade })
const requestInfo = ({ url, upgrade }) => ({ url, upgrade });

const server = ({ port, requestHandler = () => {}, wssOnly }) => {
  console.debug("creating server");
  const server = createServer((req, res) => {
    if (req.url !== "/logger") {
      console.debug("handling request", requestInfo(req));
    }
    requestHandler(req, res, parse(req.url, true));
  });

  server.on("upgrade", function (req, socket, head) {
    const { pathname } = parse(req.url, true);
    if (pathname === "/dgt") {
      console.debug("upgrading dgt socket", requestInfo(req));
      wssBoardHandler(req, socket, head);
    }
    if (pathname === "/logger") {
      console.debug("upgrading logger socket", requestInfo(req));
      wssLoggerHandler(req, socket, head);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.debug("server ready");
    console.log(
      `> Ready on ${
        wssOnly ? "" : `http://localhost:${port} `
      }ws://localhost:${port}`
    );
  });
};

export default server;

import { createServer } from "http";
import { parse } from "url";
import wssBoardHandler from "./wss-board-handler.js";

const server = ({ port, requestHandler = () => {}, wssOnly }) => {
  const server = createServer((req, res) =>
    requestHandler(req, res, parse(req.url, true))
  );

  server.on("upgrade", function (req, socket, head) {
    const { pathname } = parse(req.url, true);
    if (pathname === "/dgt") {
      wssBoardHandler(req, socket, head);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Ready on ${
        wssOnly ? "" : `http://localhost:${port} `
      }ws://localhost:${port}`
    );
  });
};

export default server;

const logger = require(process.env.MOCK ? "../dgt-logger-mock/server" : "../dgt-logger")

const WebSocket = require('ws');

void (async () => {
  const { info, subscribe } = await logger();
  const wss = new WebSocket.Server({ port: 1983 });

  wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify(info()));

    subscribe(data => {
      const jsonData = JSON.stringify(data)
      ws.send(jsonData)
    });
  });
})();


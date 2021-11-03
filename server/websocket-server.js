const WebSocket = require("ws");
const { boardEventListener, boardReset } = require("./board-event-listener.js");

const wss = new WebSocket.Server({ port: 1983 });

wss.on("connection", async function connection(ws) {
  console.log('incoming connection');
  const unsubscribe = await boardEventListener(data => {
    ws.send(data)
    console.log(data)
  })

  ws.onclose = () => {
    console.log('connection closed', wss.clients.size);
    unsubscribe();
    if (!wss.clients.size) {
      // nodemon will restart with this exit command
      process.kill(process.pid, 'SIGUSR2')
      // boardReset()
    }
  };
});

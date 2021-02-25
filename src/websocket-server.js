const boardListener = require("./board-listener.js");
const SubscriberFactory = require("./subscriber-factory.js");
const WebSocket = require("ws");
const UnchunkerFactory = require("./unchunker-factory.js");
const { readdir } = require("fs");

const getFiles = () =>
  new Promise((resolve, reject) =>
    readdir("/dev", (err, files) => {
      if (err) {
        reject(err);
      } else
        resolve(
          files
            .filter((file) => /^tty\.DGT_/.test(file))
            .map((file) => `/dev/${file}`)
        );
    })
  );

void (async () => {
  const wss = new WebSocket.Server({ port: 1983 });

  const { subscribers, subscribe } = SubscriberFactory();

  const unchunker = UnchunkerFactory((incoming) => {
    const [type, mystery, length, ...message] = incoming;
    subscribers.forEach((subscriber) => {
      subscriber(JSON.stringify({ type, message, mystery }));
    });
  });

  console.log("connecting to board");
  const files = await getFiles();
  const sendMessage = await boardListener(files[0], unchunker);
  console.log("connected");

  wss.on("connection", function connection(ws) {
    const unsubscribe = subscribe((data) => ws.send(data));

    ws.onmessage = (messageRaw) => {
      const message = JSON.parse(messageRaw.data);
      if (message.type === "sendboard" && typeof message.code !== "undefined") {
        sendMessage(message.code);
      }
    };

    ws.onclose = () => {
      unsubscribe();
    };
  });
})();

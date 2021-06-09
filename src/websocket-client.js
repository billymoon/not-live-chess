const WebSocket = require("ws");
const SubscriberFactory = require("./subscriber-factory.js");

module.exports = (onOpen) => {
  const ws = new WebSocket(process.env.WEBSOCKET || "ws://localhost:1983");
  const sendCode = (code) =>
    ws.send(JSON.stringify({ type: "sendboard", code }));

  const { subscribers, subscribe } = SubscriberFactory();

  ws.on("message", (messageRaw) => {
    const message = JSON.parse(messageRaw);
    subscribers.forEach((subscriber) => {
      subscriber(message);
    });
  });

  ws.on("open", onOpen);

  return { subscribe, sendCode };
};

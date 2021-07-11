const WebSocket = require("ws");
const interpreter = require("./interpreter.js");

const websocketClient = callback => new Promise((resolve, reject) => {
  const latest = {
    reason: "init",
    position: null,
    charge: {
      percent: null,
      charging: null
    }
  }

  const ws = new WebSocket(process.env.WEBSOCKET || "ws://localhost:1983");

  ws.on("message", (messageRaw) => {
    const message = JSON.parse(messageRaw);
    const decoded = interpreter(message.type, message.message)
    if (decoded.position && decoded.position !== latest.position) {
      latest.position = decoded.position
      latest.reason = "position"
    } else if (decoded.charge && (decoded.charge.percent !== latest.charge.percent || decoded.charge.charging !== latest.charge.charging)) {
      latest.charge = decoded.charge
      latest.reason = "charge"
    } else {
      // console.log({ ignore: messageRaw })
      return
    }
    // console.log(latest)
    callback(latest)
  });

  ws.on("open", () => resolve(ws))
})

module.exports = websocketClient

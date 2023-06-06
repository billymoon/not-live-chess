const getWSUrl = (location) => {
  const url = new URL("/dgt", location);
  url.protocol = url.protocol.replace("http", "ws");
  return url.toString();
};

const websocketClient = (config, callback) =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket(getWSUrl(config.location));

    ws.onmessage = (messageRaw) => {
      const message = JSON.parse(messageRaw.data);
      console.debug("dgt:message", message);
      // if (message.charging) {
      //   // window.api.say("Nice");
      //   // console.log("Nice...")
      // } else {
      //   // console.log("bad...")
      // }
      callback(message);
    };

    ws.onopen = () => resolve(ws);
  });

export default websocketClient;

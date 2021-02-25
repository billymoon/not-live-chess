const websocketClient = require("./websocket-client.js");
const fenish = require("./fenish.js");

const DGT_SEND_RESET = "40";
const DGT_SEND_BRD = "42";
const DGT_SEND_UPDATE_BRD = "44";
const DGT_RETURN_SERIALNR = "45";
const DGT_SEND_BATTERY_STATUS = "4C";
const DGT_SEND_VERSION = "4D";

const dgtBoardApi = callback => {
  const { sendCode, subscribe } = websocketClient(() => {
    sendCode(DGT_SEND_RESET);
    sendCode(DGT_SEND_UPDATE_BRD);
    subscribe((message) => {
      if (message.type === 142 && message.message[1] !== 0) {
        // TODO: perhaps calculate position from update message instead of
        //       making another call to the board to get the position
        getInfo().then(callback)
      }
    })
    getInfo().then(callback)
  });

  const getInfo = () =>
    new Promise((resolve, reject) => {
      const out = {};
      const unsubscribe = subscribe(({ type, message }) => {
        if (type === 147) {
          out.version = `${message[0]}.${message[1]}`;
        } else if (type === 145) {
          out.serialNumber = message.map((i) => String.fromCharCode(i)).join("");
        } else if (type === 134) {
          out.position = fenish(message);
        } else if (type === 160) {
          const percent = message[0];
          const charging = message[8] === 1;
          out.charge = { percent, charging };
        }

        if (out.version && out.serialNumber && out.position && out.charge) {
          resolve(out);
          unsubscribe();
        }
      });
      sendCode(DGT_SEND_VERSION);
      sendCode(DGT_RETURN_SERIALNR);
      sendCode(DGT_SEND_BRD);
      sendCode(DGT_SEND_BATTERY_STATUS);
    });  
}

module.exports = dgtBoardApi
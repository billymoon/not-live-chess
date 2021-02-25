const SerialPort = require("serialport");

const boardListener = (socketPort, callback) =>
  new Promise((resolve, reject) => {
    const serialport = new SerialPort(socketPort, {
      baudRate: 9600,
      autoOpen: false,
    });

    let tries = 15;

    const openSerialPort = () => {
      serialport.open((err) => {
        if (tries--) {
          if (err) {
            console.log({ err });
            setTimeout(openSerialPort, 2000);
          } else {
            serialport.on("data", callback);
            resolve((message) => serialport.write(Buffer.from(message, "hex")));
          }
        } else {
          reject({
            err: "BOARD_CONNECT_RETRIES_EXCEEDED",
            message: "ran out of tries connecting to socket",
          });
        }
      });
    };

    openSerialPort();
  });

module.exports = boardListener;

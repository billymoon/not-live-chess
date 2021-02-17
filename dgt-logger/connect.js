const { readdir } = require("fs");
const boardConnector = require("./board-connector");
const { fenish } = require("./chess-utils");

const POSITION_LOOP_INTERVAL = 250;

const connect = async () => {
  const files = await new Promise((resolve, reject) =>
    readdir("/dev", (err, files) => {
      if (err) {
        reject(err);
      } else resolve(files);
    })
  );

  const sockets = files
    .filter((file) => /^tty\.DGT_/.test(file))
    .map((file) => `/dev/${file}`);

  if (!sockets.length) {
    throw new Error("No board to connect to..!?");
    return;
  }

  const socket = sockets.pop();

  const subscribers = [];

  const subscribe = (callback) => {
    if (subscribers.indexOf(callback) === -1) {
      subscribers.push(callback);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(subscribers.indexOf(callback), 1);
        }
      };
    }
  };

  const {
    reset,
    getBoard,
    getSerialNumber,
    getVersion
  } = await boardConnector(socket);

  await reset();
  const serialNumber = await getSerialNumber();
  const version = await getVersion();
  const initialPosition = fenish(await getBoard());

  let position = initialPosition;

  const info = () => ({
    version,
    serialNumber,
    initialPosition,
    position,
  });

  const checkForNewPosition = async () => {
    const nextPosition = fenish(await getBoard());
    if (nextPosition !== position) {
      position = nextPosition;
      subscribers.forEach((subscriber) => subscriber(info()));
    }

    setTimeout(checkForNewPosition, POSITION_LOOP_INTERVAL);
  };

  checkForNewPosition();

  return {
    info,
    subscribe,
  };
};

module.exports = connect;

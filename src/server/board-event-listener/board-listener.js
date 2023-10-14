import boardApi from "./board-api.js";
import getSocket from "./get-socket.js";
import UnchunkerFactory from "./unchunker-factory.js";
import SubscriberFactory from "../../utils/subscriber-factory.js";
import interpreter from "./interpreter.js";

const { broadcast, subscribe } = SubscriberFactory();

let board = null;
let serialport = null;
let unchunker = null;

const getBoard = async () => {
  if (!board) {
    serialport =
      serialport ||
      (await getSocket(
        () => console.log("serialport is open"),
        (data) => unchunker(data),
        (err) => {
          const errorObject = { type: "error", data: err };
          console.log(JSON.stringify(errorObject));
          broadcast(errorObject);
          if (err.disconnected) {
            board = null;
            serialport = null;
            console.log("reset board");
          }
        }
      ));
    board = boardApi(serialport);
    let include = {};
    unchunker =
      unchunker ||
      UnchunkerFactory((incoming) => {
        const [type, mystery, length, ...message] = incoming;
        const decoded = interpreter(type, message);
        broadcast({
          type: "raw",
          timestamp: new Date().toISOString(),
          data: { type, message, decoded },
        });

        if (type == 142) {
          if (include.move) {
            include = { ...decoded, also: include.move };
          } else {
            include = decoded;
            board.position();
          }
        } else if (type == 134) {
          broadcast({ ...include, ...decoded });
          include = {};
        } else if (type == 160) {
          broadcast({ ...decoded.charge });
        }
      });
  }
  return board;
};

export const boardListener = async (callback) => {
  const unsubscribe = subscribe(callback);
  const board = await getBoard();
  board.init();
  board.position();
  board.battery();
  const interval = setInterval(() => {
    board.battery();
  }, 1000 * 2);
  return () => {
    clearInterval(interval);
    unsubscribe();
  };
};

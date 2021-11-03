const boardApi = require("./board-api.js");
const getSocket = require("./get-socket.js");
const UnchunkerFactory = require("./unchunker-factory.js");
const SubscriberFactory = require("./subscriber-factory.js");
const { subscribers, subscribe } = SubscriberFactory();

let board = null
let serialport = null
let unchunker = null

const getBoard = async callback => {
    if (!board) {
        serialport = serialport || await getSocket(
            () => console.log('open'),
            data => unchunker(data)
        )
        board = boardApi(serialport)
        unchunker = unchunker || UnchunkerFactory(incoming => {
            const [type, mystery, length, ...message] = incoming;
            if (type == 142) {
                board.position()
            } else {
                callback(JSON.stringify({ type, message }))
            }
            subscribers.forEach((subscriber) => {
                subscriber(JSON.stringify({ type, message }));
            });
        });
    }
    return board
}

const boardEventListener = async callback => {
    const unsubscribe = subscribe(callback)
    const board = await getBoard(callback)
    board.init()
    board.position()
    return unsubscribe
}

const boardReset = () => {
    try {
        serialport.close(console.log)
    } catch (err) {}
    board = null
    serialport = null
    unchunker = null
}

module.exports = { boardEventListener, boardReset };
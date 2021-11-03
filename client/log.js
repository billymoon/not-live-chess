const { exec } = require("child_process");
const websocketClient = require("./websocket-client.js");
const { Chess } = require("chess.js");
const STOCKFISH = require("stockfish");

const say = (words, ...others) => {
    const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
    exec(`say -v Fiona '${phraseRaw}'`);
    // console.log(phraseRaw)
};

const stockfish = new STOCKFISH()

stockfish.onmessage = function(event) {
    //NOTE: Web Workers wrap the response in an object.
    console.log(event.data ? event.data : event);
};

const chess = new Chess()
websocketClient(data => {
    if (data.position === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
        say`ready to go`
    } else if (data.position === "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR") {
        say`kings pawn game`
    } else if (data.position === "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R") {
        say`scotch game`
    } else if (data.position === "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R") {
        say`italian game`
    } else if (data.position === "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R") {
        say`two knights defense`
    } else if (data.position === "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R") {
        say`fried liver attack`
    } else if (data.position === "r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R") {
        say`traxler counter attack`
    } else if (data.position === "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R") {
        say`ruy lopez`
    } else if (data.position === "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R") {
        say`morphy defense`
    } else {
        say`don't touch the board`
    }
    const fen = `${data.position} w - - 0 1`
    console.log(fen)
    // stockfish.postMessage(`position fen ${fen}`);
    // stockfish.postMessage(`go depth 15`);
    chess.reset()
    console.log(chess.load(fen))
    console.log(chess.ascii())
    console.log(data.position)
})

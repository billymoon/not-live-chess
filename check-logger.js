const { exec } = require("child_process");
const { Chess } = require("chess.js");
const logger = require(process.env.SOCK ? "./dgt-logger-socket/client" : "./dgt-logger")
const { moveAsSpoken, startPosition } = require("./dgt-logger/chess-utils");

const say = (words, ...others) => {
  const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
  exec(`say '${phraseRaw}'`);
};

const chess = new Chess();

const getNextMoves = () => chess.moves().map((move) => {
  const clone = new Chess(chess.fen());
  clone.move(move);
  return clone.fen().replace(/ .*/, "");
});

let playing = false;

const handleBoard = (info) => {
  if (info.position === startPosition) {
    say`ready to go!`;
    chess.reset();
    playing = true;
  } else if (playing) {
    const nextPositions = getNextMoves()

    if (nextPositions.indexOf(info.position) !== -1) {
      const move = chess.moves()[nextPositions.indexOf(info.position)];
      chess.move(move);
      say`${moveAsSpoken(move)}`;
      console.log(chess.pgn());
    }
  }
};

void (async () => {
  const { info, subscribe } = await logger();
  say`connected!`;
  handleBoard(info());
  subscribe(handleBoard);
})();

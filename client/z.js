const { Chess } = require("chess.js");

const chess = new Chess("6k1/5pp1/2p4p/8/6PP/8/2pK4/1q6 b - - 0 1")
console.log(chess.moves())
chess.move("c1=R")
const lastMove = chess.history({ verbose: true }).pop();
const UCIMove = `${lastMove.from}${lastMove.to}${lastMove.promotion || ""}`;

console.log({ UCIMove, lastMove })
console.log(chess.ascii())
// import { Chess } from 'chess.js'
// import { Chess } from '../../../../chess'
// import dynamic from "next/dynamic";
import ChessJs from "chess.js";

// const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
// const {Chess} = dynamic(() => import("chess.js"), { ssr: false });

const Chess = ChessJs.Chess || ChessJs;

const moveFromFenPositions = (sourceFen, targetPosition, shallow = false) => {
  const chess = new Chess();
  chess.load(sourceFen);
  const moves = chess
    .moves({ verbose: true })
    .map(({ from, to }) => ({ from, to }));
  let found = false;
  moves.forEach((move, index) => {
    if (!found) {
      // return early if we found it
      chess.load(sourceFen);
      chess.move(move);
      if (chess.fen().split(" ")[0] === targetPosition) {
        found = [moves[index]];
      }
    }
  });

  if (!found && !shallow) {
    // look 2 ply deep
    let found2 = false;
    moves.forEach((move, index) => {
      chess.load(sourceFen);
      chess.move(move);
      const move2 = moveFromFenPositions(chess.fen(), targetPosition, true);
      if (move2) {
        found2 = [move, ...move2];
      }
    });
    // console.log({found, found2})
    return found2;
  }

  return found;
};

const Game = () => {
  const chess = new Chess();

  // const nextPositions = chess.moves().map((move) => {
  //     const clone = new Chess(chess.fen());
  //     clone.move(move);
  //     return clone.fen().replace(/ .*/, "");
  //   })

  const moveToPosition = (position) => {
    const moves = moveFromFenPositions(chess.fen(), position);
    if (moves) {
      console.log(moves);
      moves.forEach((move) => {
        chess.move(move);
      });
    }
    return chess.fen().replace(/ .*/, "");
  };

  return {
    fen: () => chess.fen(),
    reset: () => chess.reset(),
    pgn: () => chess.pgn(),
    chess,
    // nextPositions,
    moveToPosition,
  };
};

export default Game;

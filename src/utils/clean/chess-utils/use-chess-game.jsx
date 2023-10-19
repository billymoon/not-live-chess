import { useMemo, useState } from "react";
import { Chess } from "chess.js";

// const START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

export const moveFromFenPositions = (
  sourceFen,
  targetPosition,
  shallow = false
) => {
  const chess = new Chess();
  try {
    chess.load(sourceFen);
  } catch (err) {
    console.log(err);
    return false;
  }
  const moves = chess
    .moves({ verbose: true })
    .map(({ from, to, san }) => ({ from, to, san }));
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
    return found2;
  }

  return found;
};

const stateFromChess = (chess) => {
  const history = chess.history({ verbose: true });
  return {
    pgn: chess.pgn(),
    fen: chess.fen(),
    history,
    previousFen: history.length ? history.slice(-1)[0].before : null,
  };
};

const useChessGame = () => {
  const chess = useMemo(() => new Chess(), []);
  const [gameState, setGameState] = useState(stateFromChess(chess));
  const loadFromHistory = useMemo(
    () => (moves) => {
      chess.reset();
      moves.forEach((move) => chess.move(move));
      setGameState(stateFromChess(chess));
    },
    [chess]
  );

  const moveToPosition = (position) => {
    const before = chess.fen();
    const moves = moveFromFenPositions(before, position);
    if (moves) {
      moves.forEach((move) => chess.move(move));
    }
    const after = chess.fen();
    if (before !== after) {
      setGameState(stateFromChess(chess));
    }
    return before !== after;
  };

  const takebackToPosition = (position) => {
    const undone = chess.undo();
    if (
      undone &&
      chess.fen().replace(/ .*/, "") !== position &&
      !moveToPosition(position)
    ) {
      chess.move(undone);
    } else {
      setGameState(stateFromChess(chess));
    }
  };

  const reset = () => {
    chess.reset();
    setGameState(stateFromChess(chess));
  };

  const move = ({ from, to }) => {
    chess.move({ from, to });
    setGameState(stateFromChess(chess));
  };

  return {
    ...gameState,
    reset,
    moveToPosition,
    move,
    takebackToPosition,
    loadFromHistory,
  };
};

export default useChessGame;

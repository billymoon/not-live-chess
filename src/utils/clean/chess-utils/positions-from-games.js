const { Chess } = require("chess.js");
const { gameTreesFromPgnGames } = require("./pgn-parser.js");

const chess = new Chess();

export const positionsFromGameTrees = (gameTrees) => {
  chess.reset();
  // const start = chess.fen().split(" ")[0]
  const positions = [];

  const addPosition = ({ parent }) => {
    const fenPosition = chess.fen().split(" ")[0];
    const existing = positions.find((item) => item.fenPosition === fenPosition);
    if (existing) {
      if (existing.parents.indexOf(parent) === -1) {
        existing.parents.push(parent);
      }
    } else {
      positions.push({
        fenPosition,
        parents: parent ? [parent] : [],
      });
    }
  };

  const handleMove = (move) => {
    const fenPosition = chess.fen().split(" ")[0];
    if (typeof move === "string") {
      chess.move(move);
      addPosition({ parent: fenPosition });
    } else {
      chess.move(move[0]);
      addPosition({ parent: fenPosition });
      move.slice(1).forEach(handleMove);
    }
  };

  addPosition({ parent: null });

  gameTrees.forEach((gameTree) => {
    chess.reset();
    gameTree.moves.forEach(handleMove);
  });

  return positions;
};

export const positionsFromPgn = (pgn) =>
  positionsFromGameTrees(gameTreesFromPgnGames(pgn));

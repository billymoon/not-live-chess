// import { Chess } from '../../chess'
import Chess from "chess.js";

const positionDiff = (targetFen, currentFen) => {
  const target = targetFen
    .replace(/\d/g, (d) => new Array(parseInt(d, 10)).fill(".").join(""))
    .split("");
  const currentPosition = currentFen
    .replace(/\d/g, (d) => new Array(parseInt(d, 10)).fill(".").join(""))
    .split("");
  const badlyPlacedPiecesFen = currentPosition
    .map((v, i) => (v === "/" ? v : target[i] === v ? "." : v))
    .join("")
    .replace(/(\.+)/g, (d) => d.length.toString());
  const missingPiecesFen = currentPosition
    .map((v, i) => (v === "/" ? v : target[i] === v ? "." : target[i]))
    .join("")
    .replace(/(\.+)/g, (d) => d.length.toString());

  const instructions = [];
  if (badlyPlacedPiecesFen !== "8/8/8/8/8/8/8/8") {
    const chess = new Chess();
    chess.load(`${badlyPlacedPiecesFen} w KQkq - 0 1`);
    const rowNames = ["8", "7", "6", "5", "4", "3", "2", "1"];
    const colNames = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const colors = { w: "white", b: "black" };
    const pieceNames = {
      k: "king",
      q: "queen",
      r: "rook",
      b: "bishop",
      n: "knight",
      p: "pawn",
    };
    const pieces = chess
      .board()
      .map((rows, rowIndex) =>
        rows.map((col, colIndex) =>
          !col
            ? null
            : `pick up ${colors[col.color]} ${pieceNames[col.type]} from ${
                colNames[colIndex]
              }${rowNames[rowIndex]}`
        )
      )
      .flat()
      .filter((item) => !!item);
    instructions.push(...pieces);
  } //else
  if (missingPiecesFen !== "8/8/8/8/8/8/8/8") {
    const chess = new Chess();
    chess.load(`${missingPiecesFen} w KQkq - 0 1`);
    const rowNames = ["8", "7", "6", "5", "4", "3", "2", "1"];
    const colNames = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const colors = { w: "white", b: "black" };
    const pieceNames = {
      k: "king",
      q: "queen",
      r: "rook",
      b: "bishop",
      n: "knight",
      p: "pawn",
    };
    const pieces = chess
      .board()
      .map((rows, rowIndex) =>
        rows.map((col, colIndex) =>
          !col
            ? null
            : `place ${colors[col.color]} ${pieceNames[col.type]} on ${
                colNames[colIndex]
              }${rowNames[rowIndex]}`
        )
      )
      .flat()
      .filter((item) => !!item);
    instructions.push(...pieces);
  }
  return { instructions, badlyPlacedPiecesFen, missingPiecesFen };
};

export default positionDiff;

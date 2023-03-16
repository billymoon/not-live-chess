import { fenishPositionFromFenPosition } from "./position-mappers";

const pieceObjects = {
  " ": null,
  P: { type: "p", color: "w" },
  R: { type: "p", color: "w" },
  N: { type: "n", color: "w" },
  B: { type: "b", color: "w" },
  K: { type: "k", color: "w" },
  Q: { type: "q", color: "w" },
  p: { type: "p", color: "b" },
  r: { type: "r", color: "b" },
  n: { type: "n", color: "b" },
  b: { type: "b", color: "b" },
  k: { type: "k", color: "b" },
  q: { type: "q", color: "b" },
};

const boardArrayFromFenPosition = (position) =>
  fenishPositionFromFenPosition(position)
    .split("|")
    .map((fenRow) => fenRow.split("").map((item) => pieceObjects[item]));

const positionDifferenceInstructions = (targetFen, currentFen) => {
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
    const pieces = boardArrayFromFenPosition(badlyPlacedPiecesFen)
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
    const pieces = boardArrayFromFenPosition(missingPiecesFen)
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

export default positionDifferenceInstructions;

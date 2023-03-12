const pieceSymbols = [
  " ",
  "P",
  "R",
  "N",
  "B",
  "K",
  "Q",
  "p",
  "r",
  "n",
  "b",
  "k",
  "q",
];

export const fenPositionFromFenishPosition = (fenishPosition) =>
  fenishPosition.replace(/ +/g, (all) => all.length).replace(/\|/g, "/");

export const fenishPositionFromBoardArray = (boardArray) =>
  boardArray
    .map((i) => pieceSymbols[i])
    .join("")
    .split(/(........)/g)
    .filter((i) => !!i)
    .join("|");

export const fenPositionFromBoardArray = (boardArray) =>
  fenPositionFromFenishPosition(fenishPositionFromBoardArray(boardArray));

export const fenishPositionFromFenPosition = (fenPosition) =>
  fenPosition
    .replace(/(\d)/g, (_, qty) =>
      new Array(parseInt(qty, 10)).fill(" ").join("")
    )
    .replace(/\//g, "|");

export const boardArrayFromFenishPosition = (fenishPosition) =>
  fenishPosition
    .replace(/\|/g, "")
    .split("")
    .map((i) => pieceSymbols.indexOf(i));

export const boardArrayFromFenPosition = (fenPosition) =>
  boardArrayFromFenishPosition(fenishPositionFromFenPosition(fenPosition));

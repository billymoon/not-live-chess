const pieceSymbols = [
  ".",
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

const fenish = (position) =>
  position
    .map((i) => pieceSymbols[i])
    .join("")
    .split(/(........)/g)
    .filter((i) => !!i)
    .join("/")
    .replace(/\.+/g, (all) => all.length);

const pieceNames = {
  k: "King",
  n: "Knight",
  r: "Rook",
  q: "Queen",
  b: "Bishop",
  p: "Pawn",
};

const moveAsSpoken = (move) => {
  console.log(move);

  let [
    all,
    protagonist,
    rank,
    file,
    takes,
    target,
    check,
    checkmate,
  ] = move.match(
    /^([rnbqkRNBQK])?([0-8])?([a-h])?(x)?([a-h][0-8]|O-O|O-O-O)(\+)?(#)?$/
  );

  if (target === "O-O") {
    return "Castles short";
  } else if (target === "O-O-O") {
    return "Castles long";
  } else if (target) {
    return `${protagonist ? pieceNames[protagonist.toLowerCase()] : ''}${
      rank ? rank : ""
    }${file ? file : ""}${takes ? " takes" : ""} ${target.replace('a', 'a:')}${
      check ? " check" : ""
    }${checkmate ? " checkmate!!" : ""}`;
  } else {
    console.log({ move });
    return "";
  }
};

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

module.exports = {
  fenish,
  moveAsSpoken,
  startPosition
};

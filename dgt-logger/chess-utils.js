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
  K: "King",
  N: "Knight",
  R: "Rook",
  Q: "Queen",
  B: "Bishop",
  P: "Pawn",
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
    promotion,
    check,
    checkmate,
  ] = move.match(
    /^([RNBQK])?([0-8])?([a-h])?(x)?([a-h][0-8]|O-O|O-O-O)(?:=([RNBQ]))?(\+)?(#)?$/
  );

  if (target === "O-O") {
    return "Castles short";
  } else if (target === "O-O-O") {
    return "Castles long";
  } else if (target) {
    return `${protagonist ? pieceNames[protagonist] : ''}${
      rank ? rank : ""
    }${file ? file : ""}${takes ? " takes" : ""} ${target.replace('a', 'a:').replace('e', ":e").replace('c', ":c")}${
      promotion ? ` promote to ${pieceNames[promotion]}` : ""
    }${
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

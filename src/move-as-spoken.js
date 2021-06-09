const pieceNames = {
  K: "King",
  N: "Knight",
  R: "Rook",
  Q: "Queen",
  B: "Bishop",
  P: "Pawn",
};

const sayLetter = target => target
  .replace("a", "a:")
  .replace("e", ":e")
  .replace("c", ":c")

const moveAsSpoken = (move) => {
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
    return `${protagonist ? pieceNames[protagonist] : ""}${rank ? ` ${rank}` : ""}${
      file ? ` ${sayLetter(file)}` : ""
    }${takes ? " takes" : ""} ${sayLetter(target)}${
      promotion ? ` promote to ${pieceNames[promotion]}` : ""
    }${check ? " check" : ""}${checkmate ? " checkmate!!" : ""}`;
  } else {
    console.log({ move });
    return "";
  }
};

module.exports = moveAsSpoken;

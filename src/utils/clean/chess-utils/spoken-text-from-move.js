const pieceNames = {
  K: "King",
  N: "Knight",
  R: "Rook",
  Q: "Queen",
  B: "Bishop",
  P: "Pawn",
};

const sayLetter = (target) =>
  target.replace("a", "a:").replace("e", ":e").replace("c", ":c");

const moveAsSpoken = (move) => {
  let [
    all,
    protagonist,
    file,
    rank,
    takes,
    target,
    promotion,
    check,
    checkmate,
  ] = move.match(
    /^([RNBQK])?([a-h])?([0-8])?(x)?([a-h][0-8]|O-O|O-O-O)(?:=([RNBQ]))?(\+)?(#)?$/
  );

  if (target === "O-O") {
    return "Castles short";
  } else if (target === "O-O-O") {
    return "Castles long";
  } else if (target) {
    const out = [];
    if (protagonist) {
      out.push(pieceNames[protagonist]);
    }
    if (file) {
      if (rank) {
        out.push(`${sayLetter(file)}${rank}`);
      } else {
        out.push(sayLetter(file));
      }
    } else if (rank) {
      out.push(rank);
    }
    if (takes) {
      out.push("takes");
    }
    out.push(sayLetter(target));
    if (promotion) {
      out.push(`promote to ${pieceNames[promotion]}`);
    }
    if (check) {
      out.push("check");
    }
    if (checkmate) {
      out.push("checkmate!!");
    }
    return out.join(" ");
  } else {
    console.log({ move });
    return "";
  }
};

export default moveAsSpoken;

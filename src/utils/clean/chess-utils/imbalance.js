const imbalance = (fen) => {
  const pieces = { q: 0, r: 0, b: 0, n: 0, p: 0 };
  const asciiBlack = { r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟" };
  const asciiWhite = { r: "♖", n: "♘", b: "♗", q: "♕", k: "♔", p: "♙" };

  for (let i = 0; fen[i] !== " " && i < fen.length; i++) {
    const c = fen[i];
    switch (c) {
      case "Q":
        pieces.q++;
        break;
      case "R":
        pieces.r++;
        break;
      case "B":
        pieces.b++;
        break;
      case "N":
        pieces.n++;
        break;
      case "P":
        pieces.p++;
        break;
      case "q":
        pieces.q--;
        break;
      case "r":
        pieces.r--;
        break;
      case "b":
        pieces.b--;
        break;
      case "n":
        pieces.n--;
        break;
      case "p":
        pieces.p--;
        break;
    }
  }
  const [white, black] = Object.entries(pieces).reduce(
    ([w, b], [key, value]) => [
      value > 0 ? `${w}${Array(value).fill(key).join("")}` : w,
      value < 0 ? `${b}${Array(Math.abs(value)).fill(key).join("")}` : b,
    ],
    ["", ""]
  );
  const capturedByWhite = white.replace(/(.)/g, (a, p) => asciiBlack[p]);
  const capturedByBlack = black.replace(/(.)/g, (a, p) => asciiWhite[p]);
  const score =
    pieces.q * 9 + pieces.r * 5 + (pieces.b + pieces.n) * 3 + pieces.p;

  return {
    capturedByWhite,
    capturedByBlack,
    score,
  };
};

export default imbalance;

import imbalance from "./imbalance";

const fixtures = [
  {
    name: "start position",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    capturedByWhite: "",
    capturedByBlack: "",
    score: 0,
  },
  {
    name: "black pawn down",
    fen: "r1bqkbnr/pppp1ppp/8/4N3/2BnP3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4",
    capturedByWhite: "♟",
    capturedByBlack: "",
    score: 1,
  },
  {
    name: "black pawn down",
    fen: "r1bqkbnr/pppp1ppp/8/4n3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4",
    capturedByWhite: "♟",
    capturedByBlack: "♘",
    score: -2,
  },
  {
    name: "rook for queen",
    fen: "r1bqkbnR/pppp1pp1/8/8/4P1p1/8/PPPP1PP1/RNB1KB2 b Qq - 0 7",
    capturedByWhite: "♜",
    capturedByBlack: "♕",
    score: -4,
  },
  {
    name: "white down exchange",
    fen: "rn1qkbnr/ppp1pppp/8/3p4/7P/7P/PPPPPP2/RNBQKBN1 b Qkq - 0 3",
    capturedByWhite: "♝",
    capturedByBlack: "♖",
    score: -2,
  },
  {
    name: "white up exchange",
    fen: "1nbqkbnr/2pppppp/p7/p7/4P3/5N2/PPPP1PPP/RNBQK2R w KQk - 0 4",
    capturedByWhite: "♜",
    capturedByBlack: "♗",
    score: 2,
  },
];

fixtures.map(({ name, fen, capturedByWhite, capturedByBlack, score }) => {
  test(`imbalance ${name}`, () => {
    expect(imbalance(fen)).toEqual({ capturedByWhite, capturedByBlack, score });
  });
});

import { positionsFromPgn } from "./positions-from-games.js";

const pgnGamesFixture = `[Event "Private Study"]
[Site "Planet Earth Study 1"]
[Date "1992.11.04"]
[White "Victim"]
[Black "Protagonist"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. d4 *

[Event "Private Study"]
[Site "Planet Earth Study 2"]
[Date "1992.11.04"]
[White "Victim"]
[Black "Protagonist"]
[Result "*"]

1. Nf3 e5 2. e4 Nc6 3. d3 *
`;

const positionsFixture = [
  {
    fenPosition: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    parents: [],
  },
  {
    fenPosition: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR",
    parents: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"],
  },
  {
    fenPosition: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR",
    parents: ["rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR"],
  },
  {
    fenPosition: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R",
    parents: [
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR",
      "rnbqkbnr/pppp1ppp/8/4p3/8/5N2/PPPPPPPP/RNBQKB1R",
    ],
  },
  {
    fenPosition: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R",
    parents: ["rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R"],
  },
  {
    fenPosition: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R",
    parents: ["r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R"],
  },
  {
    fenPosition: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R",
    parents: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"],
  },
  {
    fenPosition: "rnbqkbnr/pppp1ppp/8/4p3/8/5N2/PPPPPPPP/RNBQKB1R",
    parents: ["rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R"],
  },
  {
    fenPosition: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R",
    parents: ["r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R"],
  },
];

test("positionsFromPgn", () => {
  expect(positionsFromPgn(pgnGamesFixture)).toEqual(positionsFixture);
});

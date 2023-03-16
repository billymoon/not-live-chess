import {
  gameTreesFromPgnGames,
  gameMainlinesFromPgnGames,
  splitPgnGames,
} from "./pgn-parser.js";

export const pgnGamesFixture = `[Event "Private Study"]
[Site "Planet Earth Study 1"]
[Date "1992.11.04"]
[White "Victim"]
[Black "Protagonist"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 Bc5 5. Nxf7 Bxf2+ 6. Kxf2 Nxe4+ 7. Ke3 Qh4 8. g3 Nxg3 9. hxg3 Qd4+ 10. Kf3 O-O 11. Rh4 e4+ 12. Rxe4 (12. Kg2 Qxc4 13. Ng5 Qd4 14. Rf4 Rxf4 (14... h6 15. Rxf8+ Kxf8) 15. gxf4 h6) (12. Ke2 d5) 12... Ne5+ 13. Kf4 Qf2+ 14. Kxe5 b5 15. Qf3 Re8+ 16. Kf4 Rxe4+ 17. Kg5 Qxf3 18. Ne5+ bxc4 19. Nxf3 d6 20. d4 Rg4+ 21. Kh5 Rxg3 *

[Event "Private Study"]
[Site "Planet Earth Study 2"]
[Date "1992.11.04"]
[White "Victim"]
[Black "Protagonist"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 Bc5 5. Nxf7 Bxf2+ 6. Kxf2 Nxe4+ 7. Ke3 Qh4 8. g3 Nxg3 9. hxg3 Qd4+ 10. Kf3 O-O 11. Rh4 e4+ 12. Rxe4 (12. Kg2 Qxc4 13. Ng5 Qd4 14. Rf4 Rxf4 (14... h6 15. Rxf8+ Kxf8) 15. gxf4 h6) (12. Ke2 d5) 12... Ne5+ 13. Kf4 Qf2+ 14. Kxe5 b5 15. Qf3 Re8+ 16. Kf4 Rxe4+ *
`;

const splitPgnGamesFixture = [
  `[Event "Private Study"]
[Site "Planet Earth Study 1"]
[Date "1992.11.04"]
[White "Victim"]
[Black "Protagonist"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 Bc5 5. Nxf7 Bxf2+ 6. Kxf2 Nxe4+ 7. Ke3 Qh4 8. g3 Nxg3 9. hxg3 Qd4+ 10. Kf3 O-O 11. Rh4 e4+ 12. Rxe4 Ne5+ 13. Kf4 Qf2+ 14. Kxe5 b5 15. Qf3 Re8+ 16. Kf4 Rxe4+ 17. Kg5 Qxf3 18. Ne5+ bxc4 19. Nxf3 d6 20. d4 Rg4+ 21. Kh5 Rxg3 *
`,
  `[Event "Private Study"]
[Site "Planet Earth Study 2"]
[Date "1992.11.04"]
[White "Victim"]
[Black "Protagonist"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 Bc5 5. Nxf7 Bxf2+ 6. Kxf2 Nxe4+ 7. Ke3 Qh4 8. g3 Nxg3 9. hxg3 Qd4+ 10. Kf3 O-O 11. Rh4 e4+ 12. Rxe4 Ne5+ 13. Kf4 Qf2+ 14. Kxe5 b5 15. Qf3 Re8+ 16. Kf4 Rxe4+ *
`,
];

export const positionsFixture = ["RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr"];

const gameTreeFixture = [
  {
    headers: [
      {
        name: "Event",
        value: "Private Study",
      },
      {
        name: "Site",
        value: "Planet Earth Study 1",
      },
      {
        name: "Date",
        value: "1992.11.04",
      },
      {
        name: "White",
        value: "Victim",
      },
      {
        name: "Black",
        value: "Protagonist",
      },
      {
        name: "Result",
        value: "*",
      },
    ],
    moves: [
      "e4",
      "e5",
      "Nf3",
      "Nc6",
      "Bc4",
      "Nf6",
      "Ng5",
      "Bc5",
      "Nxf7",
      "Bxf2+",
      "Kxf2",
      "Nxe4+",
      "Ke3",
      "Qh4",
      "g3",
      "Nxg3",
      "hxg3",
      "Qd4+",
      "Kf3",
      "O-O",
      "Rh4",
      "e4+",
      [
        "Rxe4",
        [
          "Kg2",
          "Qxc4",
          "Ng5",
          "Qd4",
          "Rf4",
          ["Rxf4", ["h6", "Rxf8+", "Kxf8"]],
          "gxf4",
          "h6",
        ],
        ["Ke2", "d5"],
      ],
      "Ne5+",
      "Kf4",
      "Qf2+",
      "Kxe5",
      "b5",
      "Qf3",
      "Re8+",
      "Kf4",
      "Rxe4+",
      "Kg5",
      "Qxf3",
      "Ne5+",
      "bxc4",
      "Nxf3",
      "d6",
      "d4",
      "Rg4+",
      "Kh5",
      "Rxg3",
    ],
  },
  {
    headers: [
      {
        name: "Event",
        value: "Private Study",
      },
      {
        name: "Site",
        value: "Planet Earth Study 2",
      },
      {
        name: "Date",
        value: "1992.11.04",
      },
      {
        name: "White",
        value: "Victim",
      },
      {
        name: "Black",
        value: "Protagonist",
      },
      {
        name: "Result",
        value: "*",
      },
    ],
    moves: [
      "e4",
      "e5",
      "Nf3",
      "Nc6",
      "Bc4",
      "Nf6",
      "Ng5",
      "Bc5",
      "Nxf7",
      "Bxf2+",
      "Kxf2",
      "Nxe4+",
      "Ke3",
      "Qh4",
      "g3",
      "Nxg3",
      "hxg3",
      "Qd4+",
      "Kf3",
      "O-O",
      "Rh4",
      "e4+",
      [
        "Rxe4",
        [
          "Kg2",
          "Qxc4",
          "Ng5",
          "Qd4",
          "Rf4",
          ["Rxf4", ["h6", "Rxf8+", "Kxf8"]],
          "gxf4",
          "h6",
        ],
        ["Ke2", "d5"],
      ],
      "Ne5+",
      "Kf4",
      "Qf2+",
      "Kxe5",
      "b5",
      "Qf3",
      "Re8+",
      "Kf4",
      "Rxe4+",
    ],
  },
];

const gameMainlinesFixture = [
  {
    headers: [
      {
        name: "Event",
        value: "Private Study",
      },
      {
        name: "Site",
        value: "Planet Earth Study 1",
      },
      {
        name: "Date",
        value: "1992.11.04",
      },
      {
        name: "White",
        value: "Victim",
      },
      {
        name: "Black",
        value: "Protagonist",
      },
      {
        name: "Result",
        value: "*",
      },
    ],
    moves: [
      "e4",
      "e5",
      "Nf3",
      "Nc6",
      "Bc4",
      "Nf6",
      "Ng5",
      "Bc5",
      "Nxf7",
      "Bxf2+",
      "Kxf2",
      "Nxe4+",
      "Ke3",
      "Qh4",
      "g3",
      "Nxg3",
      "hxg3",
      "Qd4+",
      "Kf3",
      "O-O",
      "Rh4",
      "e4+",
      "Rxe4",
      "Ne5+",
      "Kf4",
      "Qf2+",
      "Kxe5",
      "b5",
      "Qf3",
      "Re8+",
      "Kf4",
      "Rxe4+",
      "Kg5",
      "Qxf3",
      "Ne5+",
      "bxc4",
      "Nxf3",
      "d6",
      "d4",
      "Rg4+",
      "Kh5",
      "Rxg3",
    ],
  },
  {
    headers: [
      {
        name: "Event",
        value: "Private Study",
      },
      {
        name: "Site",
        value: "Planet Earth Study 2",
      },
      {
        name: "Date",
        value: "1992.11.04",
      },
      {
        name: "White",
        value: "Victim",
      },
      {
        name: "Black",
        value: "Protagonist",
      },
      {
        name: "Result",
        value: "*",
      },
    ],
    moves: [
      "e4",
      "e5",
      "Nf3",
      "Nc6",
      "Bc4",
      "Nf6",
      "Ng5",
      "Bc5",
      "Nxf7",
      "Bxf2+",
      "Kxf2",
      "Nxe4+",
      "Ke3",
      "Qh4",
      "g3",
      "Nxg3",
      "hxg3",
      "Qd4+",
      "Kf3",
      "O-O",
      "Rh4",
      "e4+",
      "Rxe4",
      "Ne5+",
      "Kf4",
      "Qf2+",
      "Kxe5",
      "b5",
      "Qf3",
      "Re8+",
      "Kf4",
      "Rxe4+",
    ],
  },
];

test(`gameTreesFromPgnGames`, () => {
  expect(gameTreesFromPgnGames(pgnGamesFixture)).toEqual(gameTreeFixture);
});

test(`gameMainlinesFromPgnGames`, () => {
  expect(gameMainlinesFromPgnGames(pgnGamesFixture)).toEqual(
    gameMainlinesFixture
  );
});

test(`splitPgnGames`, () => {
  expect(splitPgnGames(pgnGamesFixture)).toEqual(splitPgnGamesFixture);
});

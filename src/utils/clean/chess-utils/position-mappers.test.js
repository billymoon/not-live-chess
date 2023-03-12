import {
  fenPositionFromFenishPosition,
  fenishPositionFromBoardArray,
  fenPositionFromBoardArray,
  fenishPositionFromFenPosition,
  boardArrayFromFenishPosition,
  boardArrayFromFenPosition,
} from "./position-mappers.js";

const fixtures = [
  {
    name: "blank",
    fenPosition: "8/8/8/8/8/8/8/8",
    fenishPosition:
      "        |        |        |        |        |        |        |        ",
    boardArray: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  {
    name: "start",
    fenPosition: "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr",
    fenishPosition:
      "RNBQKBNR|PPPPPPPP|        |        |        |        |pppppppp|rnbqkbnr",
    boardArray: [
      2, 3, 4, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7,
      7, 7, 7, 7, 7, 7, 8, 9, 10, 12, 11, 10, 9, 8,
    ],
  },
  {
    name: "scotch",
    fenPosition: "R1BQKBNR/PPPP1PPP/2N5/4P3/3pp3/5n2/ppp2ppp/rnbqkb1r",
    fenishPosition:
      "R BQKBNR|PPPP PPP|  N     |    P   |   pp   |     n  |ppp  ppp|rnbqkb r",
    boardArray: [
      2, 0, 4, 6, 5, 4, 3, 2, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 7, 7,
      7, 0, 0, 7, 7, 7, 8, 9, 10, 12, 11, 10, 0, 8,
    ],
  },
];

fixtures.forEach((fixture) => {
  test(`${fixture.name} fenPositionFromFenishPosition`, () => {
    expect(fenPositionFromFenishPosition(fixture.fenishPosition)).toBe(
      fixture.fenPosition
    );
  });

  test(`${fixture.name} fenPositionFromBoardArray`, () => {
    expect(fenPositionFromBoardArray(fixture.boardArray)).toBe(
      fixture.fenPosition
    );
  });

  test(`${fixture.name} fenishPositionFromBoardArray`, () => {
    expect(fenishPositionFromBoardArray(fixture.boardArray)).toBe(
      fixture.fenishPosition
    );
  });

  test(`${fixture.name} fenishPositionFromFenPosition`, () => {
    expect(fenishPositionFromFenPosition(fixture.fenPosition)).toBe(
      fixture.fenishPosition
    );
  });

  test(`${fixture.name} boardArrayFromFenishPosition`, () => {
    expect(boardArrayFromFenishPosition(fixture.fenishPosition)).toEqual(
      fixture.boardArray
    );
  });

  test(`${fixture.name} boardArrayFromFenPosition`, () => {
    expect(boardArrayFromFenPosition(fixture.fenPosition)).toEqual(
      fixture.boardArray
    );
  });
});

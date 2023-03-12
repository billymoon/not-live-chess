import positionDifferenceInstructions from "./position-difference-instructions.js";

const fixtures = [
  {
    name: "scotch from start",
    targetFen: "R1BQKBNR/PPPP1PPP/2N5/4P3/3pp3/5n2/ppp2ppp/rnbqkb1r",
    currentFen: "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr",
    badlyPlacedPiecesFen: "1N6/4P3/8/8/8/8/3pp3/6n1",
    missingPiecesFen: "8/8/2N5/4P3/3pp3/5n2/8/8",
    instructions: [
      "pick up white knight from b8",
      "pick up white pawn from e7",
      "pick up black pawn from d2",
      "pick up black pawn from e2",
      "pick up black knight from g1",
      "place white knight on c6",
      "place white pawn on e5",
      "place black pawn on d4",
      "place black pawn on e4",
      "place black knight on f3",
    ],
  },
  {
    name: "start from start",
    targetFen: "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr",
    currentFen: "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr",
    badlyPlacedPiecesFen: "8/8/8/8/8/8/8/8",
    missingPiecesFen: "8/8/8/8/8/8/8/8",
    instructions: [],
  },
  {
    name: "scotch from scotch",
    targetFen: "R1BQKBNR/PPPP1PPP/2N5/4P3/3pp3/5n2/ppp2ppp/rnbqkb1r",
    currentFen: "R1BQKBNR/PPPP1PPP/2N5/4P3/3pp3/5n2/ppp2ppp/rnbqkb1r",
    badlyPlacedPiecesFen: "8/8/8/8/8/8/8/8",
    missingPiecesFen: "8/8/8/8/8/8/8/8",
    instructions: [],
  },
];

fixtures.forEach((fixture) => {
  test(`${fixture.move} to spoken text`, () => {
    const { instructions, badlyPlacedPiecesFen, missingPiecesFen } =
      positionDifferenceInstructions(fixture.targetFen, fixture.currentFen);
    expect(badlyPlacedPiecesFen).toBe(fixture.badlyPlacedPiecesFen);
    expect(missingPiecesFen).toBe(fixture.missingPiecesFen);
    expect(instructions).toEqual(fixture.instructions);
  });
});

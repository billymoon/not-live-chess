import spokenTextFromMove from "./spoken-text-from-move.js";

const fixtures = [
  {
    move: "e4",
    spokenText: ":e4",
  },
  {
    move: "e5",
    spokenText: ":e5",
  },
  {
    move: "Nf3",
    spokenText: "Knight f3",
  },
  {
    move: "Ke3",
    spokenText: "King :e3",
  },
  {
    move: "Qh4",
    spokenText: "Queen h4",
  },
  {
    move: "Nxf7",
    spokenText: "Knight takes f7",
  },
  {
    move: "Bxf2+",
    spokenText: "Bishop takes f2 check",
  },
  {
    move: "O-O",
    spokenText: "Castles short",
  },
  {
    move: "O-O-O",
    spokenText: "Castles long",
  },
  {
    move: "e4+",
    spokenText: ":e4 check",
  },
  {
    move: "gxf4",
    spokenText: "g takes f4",
  },
  {
    move: "Kxe5",
    spokenText: "King takes :e5",
  },
  {
    move: "Kxe5#",
    spokenText: "King takes :e5 checkmate!!",
  },
  {
    move: "R5e4",
    spokenText: "Rook 5 :e4",
  },
  {
    move: "Rbe4",
    spokenText: "Rook b :e4",
  },
  {
    move: "Qh4e1",
    spokenText: "Queen h4 :e1",
  },
  {
    move: "Qhe1",
    spokenText: "Queen h :e1",
  },
  {
    move: "Q4e1",
    spokenText: "Queen 4 :e1",
  },
  {
    move: "e1=Q",
    spokenText: ":e1 promote to Queen",
  },
  {
    move: "e1=N",
    spokenText: ":e1 promote to Knight",
  },
  {
    move: "e8=N",
    spokenText: ":e8 promote to Knight",
  },
];

fixtures.forEach((fixture) => {
  test(`${fixture.move} to spoken text`, () => {
    expect(spokenTextFromMove(fixture.move)).toBe(fixture.spokenText);
  });
});

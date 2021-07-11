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

module.exports = fenish;

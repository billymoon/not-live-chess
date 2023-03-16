import pgnParser from "pgn-parser";

const gameMapperFromPgnGames = (pgn, mapper) => {
  const results = pgnParser.parse(pgn);

  const games = results.map((result) => ({
    headers: result.headers,
    moves: result.moves.map(mapper),
  }));

  return games;
};

const mapAlternativeLinesRecursively = (item) => {
  if (item.ravs) {
    return [
      item.move,
      ...item.ravs.map((rav) => rav.moves.map(mapAlternativeLinesRecursively)),
    ];
  } else {
    return item.move;
  }
};

export const gameTreesFromPgnGames = (pgn) => {
  return gameMapperFromPgnGames(pgn, mapAlternativeLinesRecursively);
};

export const gameMainlinesFromPgnGames = (pgn) => {
  return gameMapperFromPgnGames(pgn, (item) => item.move);
};

const pgnFromGame = ({ headers, moves }) => {
  const pgnHeaders = headers
    .map(({ name, value }) => `[${name} "${value}"]`)
    .join("\n");
  const result = headers.find(({ name }) => name === "Result")?.value;
  const movelist = moves
    .map((move, index) => (index % 2 ? move : `${index / 2 + 1}. ${move}`))
    .join(" ");

  return `${pgnHeaders}\n\n${movelist}${result ? ` ${result}` : ""}\n`;
};

export const splitPgnGames = (pgn) =>
  gameMainlinesFromPgnGames(pgn).map(pgnFromGame);

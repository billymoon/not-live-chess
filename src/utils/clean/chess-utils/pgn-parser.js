const pgnParser = require("pgn-parser");

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

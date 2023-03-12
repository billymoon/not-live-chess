const fs = require("fs");
const path = require("path");

const initSqlJs = require("sql.js");
require = require("esm")(module);
// require('dotenv').config({ path: '.env.local' })

const { positionsFromGameTrees } = require("./positions-from-games.js");
const { fenishPositionFromFenPosition } = require("./position-mappers.js");
const { gameTreesFromPgnGames } = require("./pgn-parser.js");

const gameData = fs
  .readFileSync(path.join(__dirname, "..", "..", "games.ndjson"))
  .toString("utf8")
  .split("\n")
  .filter((line) => !!line)
  .map(JSON.parse);
const gamePgns = gameData.slice(-10).map((item) => item.pgn); //.join("\n\n")

initSqlJs({
  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  // You can omit locateFile completely when running in node
  //   locateFile: file => `https://sql.js.org/dist/${file}`
}).then(async (SQL) => {
  const db = new SQL.Database();
  let sqlCreate = `
DROP TABLE IF EXISTS game_positions;

DROP TABLE IF EXISTS pgn_headers;

DROP TABLE IF EXISTS positions;

DROP TABLE IF EXISTS games;

CREATE TABLE games (
    id TEXT PRIMARY KEY ON CONFLICT IGNORE,
    rated BOOLEAN,
    variant TEXT,
    speed TEXT,
    perf TEXT,
    createdAt TEXT,
    lastMoveAt TEXT,
    status TEXT,
    white_name TEXT,
    white_id TEXT,
    white_rating INTEGER,
    white_ratingDiff INTEGER,
    black_name TEXT,
    black_id TEXT,
    black_rating INTEGER,
    black_ratingDiff INTEGER,
    winner TEXT,
    moves TEXT,
    pgn TEXT,
    clock_initial INTEGER,
    clock_increment INTEGER,
    clock_totalTime INTEGER,
    days_per_turn INTEGER,
    processed BOOLEAN
);

CREATE TABLE pgn_headers (
    game_id TEXT,
    name TEXT,
    value TEXT
);

CREATE TABLE positions (
    fen_position TEXT PRIMARY KEY ON CONFLICT IGNORE,
    expanded_fen_position TEXT
);

CREATE TABLE game_positions (
    game_id TEXT,
    fen_position TEXT,
    fen_who TEXT,
    fen_castle TEXT,
    fen_enpassant TEXT,
    fen_halfmove INTEGER,
    fen_fullmove INTEGER
);
`;

  db.run(sqlCreate);

  gamePgns.forEach((gamePgn) => {
    console.time("gameTrees");
    const gameTrees = gameTreesFromPgnGames(gamePgn);
    console.timeEnd("gameTrees");
    console.time("positions");
    const positions = positionsFromGameTrees(gameTrees);
    console.timeEnd("positions");
    const id = gameTrees[0].headers
      .find((item) => item.name === "Site")
      .value.split("/")
      .slice(-1)[0];
    stmt = [];
    stmt.push(`INSERT INTO games (id) VALUES ('${id}');`);
    // console.log(id)
    // console.log(gameTrees[0].headers.map(({ name, value }) => `INSERT INTO games (id) VALUES ('${id}')`))
    // console.log(1, positions)
    // const positions = positionsFromPgn(gamePgn)
    gameTrees[0].headers.forEach(({ name, value }) => {
      stmt.push(
        `INSERT INTO pgn_headers (game_id, name, value) VALUES ('${id}', '${name}', '${value}');`
      );
    });
    positions.forEach(({ fenPosition, parents }) => {
      // console.log(1, fenPosition)
      db.run(
        `INSERT INTO positions (fen_position, expanded_fen_position) VALUES ('${fenPosition}', '${fenishPositionFromFenPosition(
          fenPosition
        )}')`
      );
      db.run(
        `INSERT INTO game_positions (game_id, fen_position) VALUES ('${id}', '${fenPosition}')`
      );
    });
    console.time("db");
    db.run(stmt.join("\n"));
    console.timeEnd("db");
  });

  // const result = db.exec("SELECT id FROM games;");
  // const result = db.exec("SELECT * FROM pgn_headers;");
  // const result = db.exec("SELECT * FROM positions;");
  const result = db.exec(
    "SELECT game_id, GROUP_CONCAT(expanded_fen_position, '\n') FROM game_positions INNER JOIN positions ON positions.fen_position = game_positions.fen_position GROUP BY game_id;"
  );
  // console.log(result[0].values);
});

const { exec } = require("child_process");
const { pipeline } = require("stream");
const { get } = require("https");
const fetch = require("isomorphic-unfetch");
const { Chess } = require("chess.js");
const { moveAsSpoken, startPosition } = require("./dgt-logger/chess-utils");

const loggerPackage = process.env.SOCK
  ? "./dgt-logger-socket/client"
  : process.env.MOCK
  ? "./dgt-logger-mock/server"
  : "./dgt-logger";

const logger = require(loggerPackage);

const say = (words, ...others) => {
  const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
  exec(`say '${phraseRaw}'`);
};

const chess = new Chess();

const getNextMoves = () =>
  chess.moves().map((move) => {
    const clone = new Chess(chess.fen());
    clone.move(move);
    return clone.fen().replace(/ .*/, "");
  });

let playing = false;
let globalGameId = null;

let knownPositions = [];

const update = (data) => {
  chess.reset();
  const moves = data.state?.moves || data.moves;
  moves.split(" ").map((move) => {
    chess.move(move, { sloppy: true });
  });
  console.log(chess.ascii());
  console.log(chess.pgn());
  say`${moveAsSpoken(chess.history().pop())}`;

  if (!playing) {
    playing = true;
    say`ready to go!`;
  }
};

const handleBoard = (info) => {
  const matchedPositions = knownPositions.filter(
    ({ fen }) => fen === info.position
  );
  if (!playing && matchedPositions.length === 1) {
    const gameId = matchedPositions[0].fullId;
    chess.reset();
    const errorHandler = (err) => err && console.log(err.message);

    async function handler(response) {
      let body = "";
      for await (const chunk of response) {
        let text = chunk.toString();
        console.log(text);
        body += text;
        try {
          const jsonLine = JSON.parse(body);
          body = "";
          update(jsonLine);
          // TODO: this is discusting..!
          globalGameId = gameId;
        } catch (err) {}
      }
    }

    // TODO: get short game id
    fetch(`https://lichess.org/game/export/${gameId.slice(0,8)}?pgnInJson=true`, {
      headers: {
        'accept': 'application/json'
      },
    })
      .then((r) => r.text())
      .then((gameData) => {
        console.log({ gameData, gameId });
        get(
          `https://lichess.org/api/board/game/stream/${gameId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TOKEN}`,
            },
          },
          (response) => handler(response).catch(console.warn)
        );
      });
  } else if (matchedPositions.length > 1) {
    say`there are more than one matched games`;
  } else if (playing) {
    const nextPositions = getNextMoves();

    if (nextPositions.indexOf(info.position) !== -1) {
      const move = chess.moves()[nextPositions.indexOf(info.position)];
      chess.move(move);
      const lastMove = chess.history({ verbose: true }).pop();
      const UCIMove = `${lastMove.from}${lastMove.to}`;

      get(
        `https://lichess.org/api/board/game/${globalGameId}/move/${UCIMove}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
        }
      );
    }
  } else if (
    info.position === "rnbq1bnr/pppppppp/4k3/8/8/8/PPPPPPPP/RNBQKBNR" ||
    info.position === "rnbqkbnr/pppppppp/8/8/8/4K3/PPPPPPPP/RNBQ1BNR"
  ) {
    say`ready steady go!`;
  } else {
    console.clear();
    console.log(info);
  }
};

void (async () => {
  const { info, subscribe } = await logger();
  const { nowPlaying } = await fetch(
    "https://lichess.org/api/account/playing",
    {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    }
  ).then((r) => r.json());

  knownPositions = knownPositions.concat(
    nowPlaying.map(({ fullId, fen }) => ({ fullId, fen }))
  );

  say`connected!`;
  handleBoard(info());
  subscribe(handleBoard);
})();
const { exec } = require("child_process");
const { pipeline } = require("stream");
const { get } = require("https");
const fetch = require("isomorphic-unfetch");
const { Chess } = require("chess.js");
const moveAsSpoken = require("./move-as-spoken.js");
const dgtBoardApi = require("./dgt-board-api.js");

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const say = (words, ...others) => {
  const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
  exec(`say -v Fiona '${phraseRaw}'`);
};

let nextMoves = [];

const init = async () => {
  const { nowPlaying } = await fetch(
    "https://lichess.org/api/account/playing",
    {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    }
  ).then((r) => r.json());

  if (!nowPlaying.length) {
    return;
  }

  clearInterval(interval);

  const { gameId, color } = nowPlaying[0];
  const chess = new Chess();

  async function lichessGameStreamHandler(response) {
    let body = "";
    for await (const chunk of response) {
      let text = chunk.toString();
      body += text;
      try {
        const jsonLine = JSON.parse(body);
        body = "";
        handleUpdateMoves(
          jsonLine.moves || jsonLine.state?.moves,
          jsonLine.wtime,
          jsonLine.btime
        );
      } catch (err) {}
    }
  }

  get(
    `https://lichess.org/api/board/game/stream/${gameId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    },
    (response) => lichessGameStreamHandler(response).catch(console.warn)
  );

  const handleUpdateMoves = (moves, wtime, btime) => {
    chess.reset();
    moves.split(" ").map((move) => {
      chess.move(move, { sloppy: true });
    });

    nextMoves = chess.moves().map((move) => {
      const clone = new Chess(chess.fen());
      clone.move(move);
      return clone.fen().replace(/ .*/, "");
    });

    console.log(chess.ascii());
    console.log(chess.pgn());
    if (chess.turn() === color[0]) {
      say`${moveAsSpoken(chess.history().pop())}`;
    } else {
      if (chess.game_over()) {
        say`game over`;
      } else {
        const remainingTime = color[0] === "w" ? wtime : btime;
        if (remainingTime < 30) {
          say`${Math.floor(remainingTime / 60000)} minutes`;
        } else {
          exec("osascript -e beep");
        }
      }
    }
  };

  dgtBoardApi(({ position }) => {
    const match = nextMoves.includes(position);
    if (match) {
      const move = chess.moves()[nextMoves.indexOf(position)];
      chess.move(move);
      const lastMove = chess.history({ verbose: true }).pop();
      const UCIMove = `${lastMove.from}${lastMove.to}`;

      get(`https://lichess.org/api/board/game/${gameId}/move/${UCIMove}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
        },
      });
    }
  });
};

const interval = setInterval(init, 20000);

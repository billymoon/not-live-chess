import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Chess from "chess.js";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import moveAsSpoken from "../utils/move-as-spoken.js";
import api from "../api/api.js";
// import Lichess from "../utils/lichess.js"
import lichess from "../utils/nextjs-lichess.js";

// const token = 't7ncvfKD6x2Q7UrQ'
// const token = 'VV9qx1jB65rkSaED'
// const lichess = Lichess({ token })

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
// const seekPosition = "rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNBQKBNR";
const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const Page = () => {
  const [position, setPosition] = useState(null);
  const [pgn, setPgn] = useState(null);
  const [fen, setFen] = useState(null);

  useEffect(() => {
    const updateState = () => {
      setPosition(chess.fen());
      setPgn(chess.pgn({ max_width: 5, newline_char: "\n" }));
      setFen(chess.fen());
      moves = getMoves();
    };

    const getMoves = () =>
      chess.moves().map((move) => {
        const clone = new Chess(chess.fen());
        clone.move(move);
        return clone.fen().replace(/ .*/, "");
      });

    const getUCIMoves = () =>
      chess.moves({ verbose: true }).map((move) => {
        const UCIMove = `${move.from}${move.to}${move.promotion || ""}`;
        return UCIMove;
      });

    const chess = new Chess();
    let myColor = null;
    let gameId = null;
    let ws = null;
    void (async () => {
      // TODO: close websocket on unmount
      ws = await nextjsWebsocketClient((data) => {
        if (data.position === startPosition) {
          // // chess.reset()
          // // updateState()
          // api.say("start position")
        } else if (data.position) {
          // if it is my turn
          if (chess.turn() === myColor) {
            const indexOfMove = getMoves().indexOf(data.position);
            // position matches legal next move
            if (indexOfMove !== -1) {
              const move = getUCIMoves()[indexOfMove];
              lichess.move(gameId, move);
            }
          }
        }
      });

      const nowPlaying = await lichess.nowPlaying();
      if (nowPlaying.length === 1) {
        const currentGame = nowPlaying[0];
        setPosition(currentGame.fen);
        myColor = currentGame.color[0];
        gameId = currentGame.fullId;
        lichess.gameStream(currentGame.fullId, (message) => {
          if (message.type === "gameFull") {
            chess.reset();
            message.state.moves.split(" ").map((move) => {
              chess.move(move, { sloppy: true });
            });
            updateState();
          } else if (message.type === "gameState") {
            chess.reset();
            message.moves.split(" ").map((move) => {
              chess.move(move, { sloppy: true });
            });
            if (chess.turn() === myColor) {
              api.say(moveAsSpoken(chess.history().slice(-1)[0]));
            }
            updateState();
          } else {
            console.log(message);
          }
        });
      } else {
        nowPlaying.forEach(console.log);
      }
    })();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <Fragment>
      <ChessboardJSX position={position} draggable={false} />
      <pre>
        <code>{fen}</code>
      </pre>
      <pre>
        <code>{pgn}</code>
      </pre>
    </Fragment>
  );
};

export default Page;

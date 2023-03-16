import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Chess } from "chess.js";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import moveAsSpoken from "../utils/move-as-spoken.js";
import api from "../api/api.js";
import { lichess } from "../utils/nextjs-lichess.js";
import { LINE_WIDTH } from "../utils/remarkable.js";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
const seekPosition = "rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNBQKBNR";
const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const millisecToMinSec = (ms) =>
  `${Math.floor(ms / 1000 / 60)} ${Math.floor((ms / 1000) % 60)}`;

const Page = () => {
  const router = useRouter();
  const [position, setPosition] = useState(null);
  const [pgn, setPgn] = useState(null);
  const [fen, setFen] = useState(null);
  const [myColorState, setMyColorState] = useState(null);

  useEffect(() => {
    const updateState = () => {
      setPosition(chess.fen());
      // setPgn(chess.pgn({ max_width: 5, newline_char: "\n" }));
      const updatedPgn = chess.pgn({
        max_width: LINE_WIDTH,
        newline_char: "\n",
      });
      api.remark(updatedPgn);
      setPgn(updatedPgn);
      setFen(chess.fen());
      // moves = getMoves();
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
    if (process.browser) {
      window.mychess = chess;
    }
    let myColor = null;
    let gameId = null;
    let ws = null;
    void (async () => {
      // TODO: close websocket on unmount
      ws = await nextjsWebsocketClient((data) => {
        if (data.position === startPosition) {
          // api.say("start position")
        } else if (data.position === seekPosition) {
          router.push("/seek");
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

      const playing = await lichess.playing();
      if (playing.length === 1) {
        const currentGame = playing[0];
        setPosition(currentGame.fen);
        myColor = currentGame.color[0];
        setMyColorState(myColor);
        gameId = currentGame.fullId;
        let headerArray = [];
        lichess.gameStream(currentGame.fullId, async (message) => {
          if (message.type === "gameFull") {
            // TODO: use game id, instead of current-game
            const currentLichessGame = await lichess.getMyCurrentGame();
            chess.reset();
            chess.loadPgn(currentLichessGame[0].pgn);
            headerArray = Object.entries(chess.header());
            chess.reset();
            headerArray.forEach((headerItem) => chess.header(...headerItem));
            message.state.moves.split(" ").map((move) => {
              chess.move(move, { sloppy: true });
            });
            updateState();
            api.say(
              `${Math.round(message.clock.initial / 1000 / 60)} minutes plus ${
                message.clock.increment / 1000
              }`
            );
          } else if (message.type === "gameState") {
            chess.reset();
            headerArray.forEach((headerItem) => chess.header(...headerItem));
            message.moves.split(" ").map((move) => {
              chess.move(move, { sloppy: true });
            });
            if (chess.turn() === myColor) {
              api.say(moveAsSpoken(chess.history().slice(-1)[0]));
            } else {
              api.say(
                millisecToMinSec(
                  myColor === "w" ? message.wtime : message.btime
                )
              );
            }
            updateState();
          } else {
            console.log(message);
          }
        });
      } else {
        playing.forEach(console.log);
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
      <ChessboardJSX
        position={position}
        draggable={false}
        orientation={myColorState === "w" ? "white" : "black"}
      />
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

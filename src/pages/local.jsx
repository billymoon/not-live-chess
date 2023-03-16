import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Container, VStack, Button } from "@chakra-ui/react";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import positionDiff from "../utils/clean/chess-utils/position-difference-instructions";
import fenish from "../utils/fenish";
import api from "../api/api.js";
import Game from "../utils/clean/chess-utils/game";
import {
  boardArrayFromFenPosition,
  fenishPositionFromFenPosition,
  fenPositionFromBoardArray,
} from "../utils/clean/chess-utils/position-mappers.js";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
const START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const useGame = () => {
  const [game, setGame] = useState(Game());
  const [pgn, setPgn] = useState(game.pgn());
  const [fen, setFen] = useState(game.fen());

  const reset = () => {
    const lastPgn = game.pgn();
    game.reset();
    setPgn(game.pgn());
    return lastPgn;
  };

  const moveToPosition = (position) => {
    const before = game.fen();
    game.moveToPosition(position);
    const after = game.fen();
    console.log(`${position}\n${before}\n${after}`);
    if (before !== after) {
      setPgn(game.pgn());
    }
    return before !== after;
  };

  useEffect(() => {
    setFen(game.fen());
  }, [pgn]);

  return {
    fen,
    pgn,
    reset,
    moveToPosition,
  };
};

const Page = () => {
  const { pgn, fen, reset, moveToPosition } = useGame();

  useEffect(() => {
    let ws;
    void (async () => {
      let lifted = [];
      ws = await nextjsWebsocketClient((data) => {
        if (data.type === "raw") {
          // console.log(data);
          if (data.data.decoded.move === "lift") {
            lifted.push(data.data.message[0]);
          } else if (data.data.decoded.move === "drop") {
            // lifted.push(data.data.decoded.message[0])
            const piecesOnBoard = fenishPositionFromFenPosition(
              fen.replace(/ .*/, "")
            )
              .replaceAll("|", "")
              .split("");
            console.log(data.data, lifted, piecesOnBoard);
            lifted = lifted.filter(
              (liftedBoardPosition) =>
                data.data.decoded.piece !== piecesOnBoard[liftedBoardPosition]
            );
            // debugger
            // lifted = [];
          }
        } else if (data.position === START_POSITION) {
          lifted = [];
          console.clear();
          console.log(reset());
        } else if (data.position) {
          const boardArray = boardArrayFromFenPosition(data.position);
          const gameArray = boardArrayFromFenPosition(fen.replace(/ .*/, ""));
          lifted.forEach((liftedBoardPosition) => {
            boardArray[liftedBoardPosition] = gameArray[liftedBoardPosition];
          });
          console.log(fenPositionFromBoardArray(boardArray));
          //   console.log(1, );
          //   console.log(2, pgn, pgn === moveToPosition(fenPositionFromBoardArray(boardArray)));
          if (moveToPosition(data.position)) {
            lifted = []; // make conditional, but on what..?
          } else if (moveToPosition(fenPositionFromBoardArray(boardArray))) {
            lifted = []; // make conditional, but on what..?
          }
          //   moveToPosition(data.position);
        } else if (data.type === "error") {
          console.log({ err: data });
        }
      });
      console.log("websocket connected", ws);
    })();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <Container mt={4}>
      <VStack>
        <ChessboardJSX
          position={fen}
          draggable={false}
          width={720}
          transitionDuration={100}
        />
        <pre>
          <code>{pgn}</code>
        </pre>
        ) : null
        <Button onClick={() => navigator.clipboard.writeText(pgn)}>Copy</Button>
      </VStack>
    </Container>
  );
};

export default Page;

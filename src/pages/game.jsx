import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Chess from "chess.js";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import moveAsSpoken from "../utils/move-as-spoken.js";
import api from "../api/api.js";
import lichess from "../utils/nextjs-lichess.js";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
// const seekPosition = "rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNBQKBNR";
const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const Game = ({ pgn, fen, header, history } = {}) => {
  const chess = new Chess();

  // const state = () => ({ ...gameState })
  // const updateState = () => {
  //   gameState.fen =  chess.fen();
  //   // gameState.ascii =  chess.ascii();
  //   gameState.pgn =  chess.pgn();
  //   gameState.history =  chess.history();
  // }

  const reset = () => {
    chess.reset();
    if (pgn) {
      if (!chess.load_pgn(pgn)) {
        throw Error("invalid pgn", pgn);
      }
      // chess.delete_comments() // can store returned comments array if wanted
    }
    if (header) {
      if (
        !chess.header(
          ...Object.entries({ ...chess.header(), ...header }).flat()
        )
      ) {
        throw Error("invalid header", header);
      }
    }
    if (fen) {
      const headerObject = chess.header();
      if (!chess.load(fen)) {
        throw Error("invalid fen", fen);
      }
      chess.header(...Object.entries(headerObject).flat());
    }
    if (history) {
      history.forEach((move) => {
        if (!chess.move(move)) {
          throw Error("invalid move", move, history);
        }
      });
    }
    // gameState.startFen = chess.fen()
    // updateState()
  };

  const move = (UCIMove) =>
    chess.move(UCIMove) ? updateState() : console.log("bad move");

  // const getPgn = () => chess.pgn({ max_width: 5, newline_char: "\n" })
  // const getFen = () => chess.fen()
  // const getFen = () => chess.fen()

  const imbalance = () => {
    const fen = chess.fen();
    const pieces = { q: 0, r: 0, b: 0, n: 0, p: 0 };
    const asciiWhite = { r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟" };
    const asciiBlack = { r: "♖", n: "♘", b: "♗", q: "♕", k: "♔", p: "♙" };

    for (let i = 0; fen[i] !== " "; i++) {
      const c = fen[i];
      switch (c) {
        case "Q":
          pieces.q++;
          break;
        case "R":
          pieces.r++;
          break;
        case "B":
          pieces.b++;
          break;
        case "N":
          pieces.n++;
          break;
        case "P":
          pieces.p++;
          break;
        case "q":
          pieces.q--;
          break;
        case "r":
          pieces.r--;
          break;
        case "b":
          pieces.b--;
          break;
        case "n":
          pieces.n--;
          break;
        case "p":
          pieces.p--;
          break;
      }
    }
    const [white, black] = Object.entries(pieces).reduce(
      ([w, b], [key, value]) => [
        value > 0 ? `${w}${Array(value).fill(key).join("")}` : w,
        value < 0 ? `${b}${Array(Math.abs(value)).fill(key).join("")}` : b,
      ],
      ["", ""]
    );
    console.log({ white, black });
    const whitePieces = white.replace(/(.)/g, (a, p) => asciiWhite[p]);
    const blackPieces = black.replace(/(.)/g, (a, p) => asciiBlack[p]);
    const score =
      pieces.q * 9 + pieces.r * 5 + (pieces.b + pieces.n) * 3 + pieces.p;
    return {
      whitePieces,
      blackPieces,
      score,
    };
  };

  const info = () => ({
    init: {
      pgn,
      fen,
      header,
      history,
    },
    fen: chess.fen(),
    imbalance,
    pgn: chess.pgn(),
    pgnSimple: () => {
      const chessHeader = chess.header();
      const pgnHeader = Object.entries(chessHeader)
        .map(([key, value]) => `[${key} "${value}"]`)
        .join("\n");
      const moveList = chess
        .history()
        .map((move, index) =>
          !(index % 2) ? `${(index / 2 + 1).toString(10)}. ${move}` : move
        )
        .join(" ");
      return `${pgnHeader}\n\n${moveList}${
        chessHeader.Result ? ` ${chessHeader.Result}` : ""
      }`;
    },
    // pgnList: chess.pgn({ max_width: 1 }),
    playerToMove:
      chess.turn() === "w" ? chess.header().White : chess.header().Black,
    colorToMove: chess.turn() === "w" ? "white" : "black",
    ended:
      (chess.header().Result && chess.header().Result !== "*") ||
      chess.game_over(),
    history: chess.history(),
    // ascii: chess.ascii(),
  });

  reset();

  return {
    chess,
    Chess,
    info,
    reset,
    move,
    // resetToStartPosition,
    // makeMove,
    // getHistory,
    // getPgn,
    // getFen,
  };
};

process.browser ? (global.game = Game()) : null;
process.browser ? (global.Game = Game) : null;

const Page = () => {
  //   const [position, setPosition] = useState(null);
  //   const [pgn, setPgn] = useState(null);
  //   const [fen, setFen] = useState(null);

  //   useEffect(() => {
  //     const updateState = () => {
  //       setPosition(chess.fen());
  //       setPgn(chess.pgn({ max_width: 5, newline_char: "\n" }));
  //       setFen(chess.fen());
  //       // moves = getMoves();
  //     };

  //     const getMoves = () =>
  //       chess.moves().map((move) => {
  //         const clone = new Chess(chess.fen());
  //         clone.move(move);
  //         return clone.fen().replace(/ .*/, "");
  //       });

  //     const getUCIMoves = () =>
  //       chess.moves({ verbose: true }).map((move) => {
  //         const UCIMove = `${move.from}${move.to}${move.promotion || ""}`;
  //         return UCIMove;
  //       });

  //     const chess = new Chess();
  //     let myColor = null;
  //     let gameId = null;
  //     let ws = null;
  //     void (async () => {
  //       // TODO: close websocket on unmount
  //       ws = await nextjsWebsocketClient((data) => {
  //         if (data.position === startPosition) {
  //           // // chess.reset()
  //           // // updateState()
  //           // api.say("start position")
  //         } else if (data.position) {
  //           // if it is my turn
  //           if (chess.turn() === myColor) {
  //             const indexOfMove = getMoves().indexOf(data.position);
  //             // position matches legal next move
  //             if (indexOfMove !== -1) {
  //               const move = getUCIMoves()[indexOfMove];
  //               lichess.move(gameId, move);
  //             }
  //           }
  //         }
  //       });

  //       const nowPlaying = await lichess.nowPlaying();
  //       if (nowPlaying.length === 1) {
  //         const currentGame = nowPlaying[0];
  //         setPosition(currentGame.fen);
  //         myColor = currentGame.color[0];
  //         gameId = currentGame.fullId;
  //         lichess.gameStream(currentGame.fullId, (message) => {
  //           if (message.type === "gameFull") {
  //             chess.reset();
  //             message.state.moves.split(" ").map((move) => {
  //               chess.move(move, { sloppy: true });
  //             });
  //             updateState();
  //             api.say(
  //               `${Math.round(message.clock.initial / 1000 / 60)} minutes plus ${
  //                 message.clock.increment / 1000
  //               }`
  //             );
  //           } else if (message.type === "gameState") {
  //             chess.reset();
  //             message.moves.split(" ").map((move) => {
  //               chess.move(move, { sloppy: true });
  //             });
  //             if (chess.turn() === myColor) {
  //               api.say(
  //                 `${moveAsSpoken(chess.history().slice(-1)[0])} ${Math.round(
  //                   (myColor === "w" ? message.wtime : message.btime) / 1000 / 60
  //                 )} minutes`
  //               );
  //             }
  //             updateState();
  //           } else {
  //             console.log(message);
  //           }
  //         });
  //       } else {
  //         nowPlaying.forEach(console.log);
  //       }
  //     })();

  //     return () => {
  //       if (ws) {
  //         ws.close();
  //       }
  //     };
  //   }, []);

  return (
    <Fragment>
      cool
      {/* <pre>
          <code>{game}</code>
        </pre> */}
      {/* <ChessboardJSX position={position} draggable={false} />
      <pre>
        <code>{fen}</code>
      </pre>
      <pre>
        <code>{pgn}</code>
      </pre> */}
    </Fragment>
  );
};

export default Page;

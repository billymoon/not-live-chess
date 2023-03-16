import { readFileSync } from "fs";
import { appendFileSync } from "fs";
import { join } from "path";
import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Chess } from "chess.js";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import moveAsSpoken from "../utils/move-as-spoken.js";
import api from "../api/api.js";
import lichess from "../utils/nextjs-lichess.js";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
// const seekPosition = "rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNBQKBNR";
const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const Page = ({ game }) => {
  const [position, setPosition] = useState(startPosition);
  const [pgn, setPgn] = useState(null);
  const [fen, setFen] = useState(null);

  useEffect(() => {
    // console.log(lichess.getUserGames('billymoon', '2021-12', '2100', 'rapid,classical,correspondence'))
  }, []);

  return (
    <Fragment>
      <ChessboardJSX position={position} draggable={false} />
      <pre>
        <code>{game}</code>
      </pre>
      <pre>
        <code>{fen}</code>
      </pre>
      <pre>
        <code>{pgn}</code>
      </pre>
    </Fragment>
  );
};

export const getServerSideProps = async () => {
  // const gamesNDJson = await lichess.getUserGames('billymoon', '2010-01', '2015-01', 'rapid,classical,correspondence')
  // const games = gamesNDJson?.split('\n').filter(x => !!x).map(JSON.parse).filter(x => !x.error)
  // appendFileSync(join('.', 'games.ndjson'), games.map(JSON.stringify).join('\n') + '\n')

  const allGames = readFileSync(join(".", "games.ndjson"), "utf8")
    .split("\n")
    .filter((x) => !!x)
    .map(JSON.parse);
  appendFileSync(
    join(".", "xgames.ndjson"),
    allGames.map(JSON.stringify).reverse().join("\n") + "\n"
  );

  return {
    props: {
      game: allGames[0].pgn,
    },
  };
};

export default Page;

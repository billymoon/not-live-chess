import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Container, VStack, Button } from "@chakra-ui/react";
import api from "../api/api";
import Chess from "chess.js";
import lichessApi from "../utils/clean/lichess-api";

const lichess = lichessApi({ token: process.env.LICHESS_TOKEN });
const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });

const Page = () => {
  const [position, setPosition] = useState(null);
  const [orientation, setOrientation] = useState("white");
  const [setupInstructions, setSetupInstructions] = useState(null);

  useEffect(() => {
    const chess = new Chess();

    void (async () => {
      const puzzle = await lichess.getDailyPuzzle();
      chess.load_pgn(puzzle[0].game.pgn);
      setPosition(chess.fen());
      setOrientation(chess.turn() === "b" ? "black" : "white");
      api.remarkablePosition(chess.fen().split(" ")[0]);
      console.log({ puzzle });
    })();
  }, []);

  return (
    <Container mt={4}>
      <VStack>
        <ChessboardJSX
          position={position}
          orientation={orientation}
          draggable={false}
          width={720}
        />
        {setupInstructions ? (
          <pre>
            <code>{setupInstructions}</code>
          </pre>
        ) : null}
      </VStack>
    </Container>
  );
};

export default Page;

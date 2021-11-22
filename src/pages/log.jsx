import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Container, VStack, Button } from "@chakra-ui/react";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import positionDiff from "../utils/position-diff";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });

const Page = () => {
  const [position, setPosition] = useState(null);
  const [setupInstructions, setSetupInstructions] = useState(null);
  // const [badPosition, setBadPosition] = useState(null);
  // const [missPosition, setMissPosition] = useState(null);

  useEffect(() => {
    nextjsWebsocketClient((data) => {
      if (data.position) {
        console.log(data);
        setPosition(data.position);

        const { instructions, missingPiecesFen } = positionDiff(
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
          data.position
        );
        // const { instructions, missingPiecesFen } = positionDiff('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R', data.position)
        // setBadPosition(badlyPlacedPiecesFen)
        // setMissPosition(missingPiecesFen)

        if (instructions.length) {
          setSetupInstructions(
            `Instructions to match target position:\n${instructions.join("\n")}`
          );
        } else {
          setSetupInstructions("we are in the target position");
        }
      } else if (data.type === "error") {
        console.log({ err: data });
      }
    }).then(() => {
      console.log("websocket connected");
    });
  }, []);

  return (
    <Container mt={4}>
      <VStack>
        <ChessboardJSX position={position} draggable={false} width={720} />
        {setupInstructions ? (
          <pre>
            <code>{setupInstructions}</code>
          </pre>
        ) : null}
        {/* <ChessboardJSX position={badPosition} draggable={false} width={300} /> */}
        {/* <ChessboardJSX position={missPosition} draggable={false} width={300} /> */}
        {/* <Button minW={72}>Awesome</Button> */}
      </VStack>
    </Container>
  );
};

export default Page;

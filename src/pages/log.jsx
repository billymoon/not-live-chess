import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Container, VStack, Button } from "@chakra-ui/react";
import nextjsWebsocketClient from "~/utils/nextjs-websocket-client.js";
import positionDiff from "~/utils/clean/chess-utils/position-difference-instructions";
import api from "~/api/api.js";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });

const REPORT_POWER_POSITION = "rnbqkbnr/pppppppp/7q/8/8/8/PPPPPPPP/RNBQKBNR";

console.debug(Math.random().toString());

const Page = () => {
  const [position, setPosition] = useState(null);
  const [setupInstructions, setSetupInstructions] = useState(null);
  const [reportPower, setReportPower] = useState(false);
  // const [badPosition, setBadPosition] = useState(null);
  // const [missPosition, setMissPosition] = useState(null);

  useEffect(() => {
    nextjsWebsocketClient((rawData) => {
      const data = rawData?.data?.decoded || rawData;
      console.log(data.charge && reportPower, { data, reportPower });
      if (data.charge && reportPower) {
        api.say(
          `Power level at ${data.charge.percent} ${
            data.charge.charging ? `and counting` : ""
          }`
        );
      }
      if (data.position) {
        console.log(data.position);
        if (data.position === REPORT_POWER_POSITION) {
          setReportPower(true);
        } else {
          setPosition(data.position);
          api.remarkablePosition(data.position);

          const { instructions, missingPiecesFen } = positionDiff(
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            data.position
          );
          // const { instructions, missingPiecesFen } = positionDiff('r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R', data.position)
          // setBadPosition(badlyPlacedPiecesFen)
          // setMissPosition(missingPiecesFen)

          if (instructions.length) {
            setSetupInstructions(
              `Instructions to match target position:\n${instructions.join(
                "\n"
              )}`
            );
          } else {
            setSetupInstructions("we are in the target position");
            api.say("target position");
          }
        }
      } else if (data.type === "error") {
        console.log({ err: data });
      }
    }).then((ws) => {
      console.log("websocket connected", ws);
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
        <Link href="/local">local</Link>
        {/* <ChessboardJSX position={badPosition} draggable={false} width={300} /> */}
        {/* <ChessboardJSX position={missPosition} draggable={false} width={300} /> */}
        {/* <Button minW={72}>Awesome</Button> */}
      </VStack>
    </Container>
  );
};

export default Page;

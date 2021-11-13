import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";
import { Container, VStack, Button } from "@chakra-ui/react";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });

const Page = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    nextjsWebsocketClient((data) => {
      // console.log(data)
      if (data.position) {
        setPosition(data.position);
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
        <ChessboardJSX position={position} draggable={false} />
        <Button minW={72}>Awesome</Button>
      </VStack>
    </Container>
  );
};

export default Page;

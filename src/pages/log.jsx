import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import nextjsWebsocketClient from "../utils/nextjs-websocket-client.js";

const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });

const Page = () => {
  const [position, setPosition] = useState(null);
  useEffect(() => {
    nextjsWebsocketClient((data) => {
      if (data.position) {
        setPosition(data.position);
      }
    });
  }, []);
  return (
    <Fragment>
      <ChessboardJSX position={position} draggable={false} />
    </Fragment>
  );
};

export default Page;

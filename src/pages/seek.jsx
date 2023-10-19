import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { lichess } from "~/utils/nextjs-lichess.js";
import api from "~/api/api.js";
import nextjsWebsocketClient from "~/utils/nextjs-websocket-client";

const START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const wsPromise = nextjsWebsocketClient((rawData) => {
      const data = rawData?.data?.decoded || rawData;
      if (data.position === START_POSITION) {
        lichess.streamEvents((message) => {
          console.log(message);
          if (message.type === "gameStart") {
            router.push("/");
          }
        });
        api.say("finding opponent");
        lichess.seek();
      }
    });

    return () => {
      wsPromise.then((ws) => ws.close());
    };
  }, []);

  return <Fragment>Seeking</Fragment>;
};

export default Page;

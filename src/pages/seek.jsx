import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { lichess } from "../utils/nextjs-lichess.js";
import api from "../api/api.js";

const Page = () => {
  const router = useRouter();

  useEffect(async () => {
    lichess.streamEvents((message) => {
      if (message.type === "gameStart") {
        router.push("/");
      }
    });
    api.say("finding opponent");
    lichess.seek();
  }, []);

  return <Fragment>Seeking</Fragment>;
};

export default Page;

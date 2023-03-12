import { Fragment, useEffect, useState } from "react";
// import dynamic from "next/dynamic";
import LichessApi from "../utils/clean/lichess-api";
import { Container, VStack, Button } from "@chakra-ui/react";
import getConfig from "next/config";
import api from "../api/api";

const { publicRuntimeConfig } = getConfig();
const lichess = LichessApi({ token: publicRuntimeConfig.lichessToken });
// import nextjsWebsocketClient from "../app/nextjs-websocket-client.js";
// import positionDiff from "../utils/position-diff";
import Chess from "chess.js";

// const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });

const Page = () => {
  //   const [account, setAccount] = useState(null);
  //   const [playing, setPlaying] = useState(null);
  //   const [myGames, setMyGames] = useState(null);

  //   useEffect(() => { console.log(account) }, [account]);
  //   useEffect(() => { console.log(playing) }, [playing]);
  //   useEffect(() => { console.log(myGames) }, [myGames]);
  useEffect(() => {
    window.lichess = lichess;
  });

  return (
    <Container mt={4}>
      <Button onClick={async () => console.log(await lichess.account())}>
        Fetch Lichess Account
      </Button>
      <Button onClick={async () => console.log(await lichess.playing())}>
        Fetch Lichess Playing
      </Button>
      <Button
        onClick={async () =>
          console.log(
            await lichess.getMyGames({
              user: "billymoon",
              since: "2023",
              speed: null,
              max: 1,
            })
          )
        }
      >
        Fetch Lichess First game of 2023
      </Button>
      <Button
        onClick={async () =>
          console.log(await lichess.getMyGames({ since: "2023" }))
        }
      >
        Fetch Lichess My 2023 Games
      </Button>
      <Button
        onClick={async () =>
          console.log(
            await lichess.getUserGames("mrslarkin", { since: "2023" })
          )
        }
      >
        Fetch Angies 2023 Games
      </Button>
      <Button
        onClick={async () =>
          console.log(await lichess.streamEvents(console.log))
        }
      >
        Stream Events
      </Button>
      <Button
        onClick={async () =>
          console.log(
            await lichess.streamEvents((data) => {
              if (data.type === "gameStart") {
                lichess.gameStream(data.game.id, console.log);
              }
            })
          )
        }
      >
        Stream My Active Game Events
      </Button>
      <Button
        onClick={async () => {
          const pgn = await lichess.getStudy("GhiNeWeu", {
            chapter: "1GAz9RmH",
          });
          const chess = new Chess();
          chess.load_pgn(pgn);
          console.log(pgn);
          await api.remarkablePosition(chess.fen().split(" ")[0], {
            flipped: true,
          });
        }}
      >
        Get study chapter
      </Button>
      <Button
        onClick={async () => {
          const puzzle = await lichess.getDailyPuzzle();
          const chess = new Chess();
          chess.load_pgn(puzzle[0].game.pgn);
          api.remarkablePosition(chess.fen().split(" ")[0], {
            flipped: chess.turn() === "b",
          });
          console.log({ puzzle });
        }}
      >
        Get daily puzzle
      </Button>
    </Container>
  );
};

export default Page;

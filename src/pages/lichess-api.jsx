import { Container, Button } from "@chakra-ui/react";
import api from "../api/api";
import { splitPgnGames } from "../utils/clean/chess-utils/pgn-parser";
import { lichess } from "../utils/nextjs-lichess";
import Chess from "chess.js";

const Page = () => {
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
          const pgn = await lichess.getStudies("billymoon");

          const chessGames = splitPgnGames(pgn).map((game) => {
            const chess = new Chess();
            chess.load_pgn(game);
            return chess;
          });

          chessGames.map((chess) => console.log(chess.pgn()));
        }}
      >
        Get studies of user
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

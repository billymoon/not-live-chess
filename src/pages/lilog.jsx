import { Fragment, useEffect, useState } from "react";
import { Chess } from "chess.js";
import api from "~/api/api.js";
import lichess from "~/utils/nextjs-lichess.js";
import { LINE_WIDTH } from "~/utils/remarkable.js";

const Page = () => {
  const [pgn, setPgn] = useState(null);

  useEffect(async () => {
    const chess = new Chess();
    const game = await lichess.getMyCurrentGame();
    chess.loadPgn(game);
    chess.deleteComments();
    const output = chess.pgn({ max_width: LINE_WIDTH });
    setPgn(output);
    api.remark(output);
  }, []);

  return (
    <Fragment>
      <pre>
        <code>{pgn}</code>
      </pre>
    </Fragment>
  );
};

export default Page;

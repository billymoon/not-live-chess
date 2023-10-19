import { useEffect, useState, memo } from "react";
import { VStack, Button } from "@chakra-ui/react";
import nextjsWebsocketClient from "~/utils/nextjs-websocket-client.js";
// import moveAsSpoken from "~/utils/move-as-spoken.js";
// import api from "~/api/api.js";
import {
  boardArrayFromFenPosition,
  fenishPositionFromFenPosition,
  fenPositionFromBoardArray,
} from "~/utils/clean/chess-utils/position-mappers.js";
import ReactECharts from "echarts-for-react";
import { Chessboard } from "react-chessboard";
import useChessGame, {
  moveFromFenPositions,
} from "~/utils/clean/chess-utils/use-chess-game";

const getSql = async () => (await import("persistent-sqlite-worker")).default;

// const ChessboardJSX = dynamic(() => import("chessboardjsx"), { ssr: false });
// const { Chessboard } = dynamic(() => import("react-chessboard"), { ssr: false });
const START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const GameTree = memo(({ data, loadFromHistory }) => {
  const click = (nodeData, ...other) => {
    loadFromHistory(
      nodeData.treeAncestors
        .slice(
          nodeData.treeAncestors.findIndex(({ name }) => name === "root") + 1
        )
        .map(({ name }) => name)
    );
    return false;
  };

  return (
    <ReactECharts
      onEvents={{ click }}
      style={{ height: "300px", width: "100%" }}
      option={{
        series: [
          {
            type: "tree",
            data: data,
            expandAndCollapse: false,
            label: {
              position: ["50%", "50%"],
              // position: 'middle',
              verticalAlign: "middle",
              align: "middle",
              fontSize: 12,
              backgroundColor: "auto",
              padding: 3,
              // top: 15,
            },
          },
        ],
      }}
    />
  );
});

const Page = () => {
  const [data, setData] = useState([]);
  const {
    pgn,
    fen,
    previousFen,
    reset,
    moveToPosition,
    takebackToPosition,
    history,
    loadFromHistory,
    move,
  } = useChessGame();

  const lastMove = history.slice(-1)[0]?.san;

  useEffect(() => {
    void (async () => {
      const sql = await getSql();
      if (lastMove) {
        // api.say(moveAsSpoken(lastMove))
        console.log(pgn);
      }
    })();
  }, [pgn]);

  useEffect(() => {
    void (async () => {
      const sql = await getSql();
      if (fen?.replace(/ .*/, "") !== previousFen?.replace(/ .*/, "")) {
        sql`INSERT INTO moves VALUES ("${fen?.replace(/ .*/, "")}", ${
          previousFen
            ? `"${previousFen?.replace(/ .*/, "")}"`
            : `"8/8/8/8/8/8/8/8"`
        });`.run();
        const moves = await sql`SELECT * from moves`.last();
        const currentPosition = fen?.replace(/ .*/, "");
        const recurse = (node, turn = "b", parentNodes = []) => {
          const isCurrent = node.position === currentPosition;
          const found = moves.filter(({ parent }) => parent === node.position);
          const dataOptions = {
            label: {
              // position: 'top',
              // verticalAlign: 'middle',
              // align: 'middle',
              // fontSize: 12,
              borderRadius: 2,
              padding: isCurrent ? 10 : 2,
              borderColor: isCurrent ? "red" : "transparent",
              borderWidth: 2,
              borderType: "solid",
              color: turn === "w" ? "black" : "white",
              backgroundColor: turn === "w" ? "white" : "black",
            },
            name:
              node.parent === "8/8/8/8/8/8/8/8"
                ? "root"
                : moveFromFenPositions(
                    `${node.parent} ${turn} KQkq - 0 1`,
                    node.position
                  )[0]?.san,
            position: node.position,
            // collapsed: false,
            collapsed: true,
          };
          parentNodes.push(dataOptions);
          dataOptions.children = found.length
            ? found.map((node) =>
                recurse(node, turn === "w" ? "b" : "w", [
                  ...(parentNodes || []),
                  dataOptions,
                ])
              )
            : [];

          if (isCurrent) {
            // console.log(parentNodes)
            // console.log(parentNodes.map(({ position: parentPosition }) => moves.find(({ position }) => position === parentPosition)))
            parentNodes.forEach((dataOptions) => {
              dataOptions.lineStyle = {
                color: "red",
              };
              dataOptions.collapsed = false;
            });
          }

          return dataOptions;
        };

        // const rec2 = (node, breadcrumbs = []) => {
        // 	console.log(node)
        // 	node.breadcrumbs = breadcrumbs
        // 	node.lineStyle = {
        // 		color: 'red',
        // 	}

        // 	return { ...node, children: node.children.map(item => rec2(item, [...(breadcrumbs || []), node])) }
        // }

        const newData = [
          recurse(moves.find(({ parent }) => parent === "8/8/8/8/8/8/8/8")),
        ]; //.map(rec2);

        // node.lineStyleColor = isCurrent ? 'green' : 'blue'
        // if (isCurrent) {
        // 	const found = moves.filter(({ parent }) => parent === node.position);
        // 	found.lineStyleColor = 'red'
        // }
        // 	lineStyle: {
        // 		color: node.lineStyleColor,
        // 	},

        if (JSON.stringify(data) !== JSON.stringify(newData)) {
          setData(newData);
        }
      }
    })();
  }, [pgn]);

  useEffect(() => {
    let ws;
    void (async () => {
      const sql = await getSql();
      window.sql = sql;
      // sql`DROP TABLE moves;`.run();
      sql`CREATE TABLE IF NOT EXISTS dgt_raw_log (timestamp STRING, data JSON);`.run();
      // sql`CREATE TABLE IF NOT EXISTS positions (position STRING, count INTEGER);`.run();
      // sql`drop table moves;`.run();
      sql`CREATE TABLE IF NOT EXISTS moves (position STRING, parent STRING, PRIMARY KEY (position, parent) ON CONFLICT IGNORE, FOREIGN KEY(parent) REFERENCES moves(position));`.run();
      let lifted = [];
      ws = await nextjsWebsocketClient((data) => {
        if (data.type === "raw") {
          const {
            timestamp,
            data: { decoded, message },
          } = data;
          sql`INSERT INTO dgt_raw_log VALUES ("${timestamp}", '${JSON.stringify(
            decoded
          )}');`.run();
          // sql`SELECT * FROM dgt_raw_log WHERE data->'position' NOT NULL ORDER BY timestamp DESC LIMIT 10;`.last().then(console.table);

          if (decoded.move === "lift") {
            lifted.push(message[0]);
          } else if (decoded.move === "drop") {
            const piecesOnBoard = fenishPositionFromFenPosition(
              fen.replace(/ .*/, "")
            )
              .replaceAll("|", "")
              .split("");
            lifted = lifted.filter(
              (liftedBoardPosition) =>
                decoded.piece !== piecesOnBoard[liftedBoardPosition]
            );
          } else if (decoded.position === START_POSITION) {
            lifted = [];
            reset();
            // api.say(`ready to go`);
          } else if (decoded.position) {
            const boardArray = boardArrayFromFenPosition(decoded.position);
            const gameArray = boardArrayFromFenPosition(fen.replace(/ .*/, ""));
            lifted.forEach((liftedBoardPosition) => {
              boardArray[liftedBoardPosition] = gameArray[liftedBoardPosition];
            });
            if (
              moveToPosition(decoded.position) ||
              takebackToPosition(decoded.position) ||
              moveToPosition(fenPositionFromBoardArray(boardArray)) ||
              takebackToPosition(fenPositionFromBoardArray(boardArray))
            ) {
              lifted = []; // make conditional, but on what..?
            }
          } else if (decoded.type === "error") {
            console.log(decoded);
          }
        }
      });
    })();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const onDrop = (from, to) => {
    try {
      move({ from, to });
      return true;
    } catch (err) {
      return false;
    }
  };

  return (
    <VStack mt={5}>
      <Chessboard
        // id="BasicBoard"
        onPieceDrop={onDrop}
        position={fen}
        boardWidth={400}
        animationDuration={100}
      />
      <pre>
        <code>{pgn}</code>
      </pre>
      ) : null
      <Button onClick={() => navigator.clipboard.writeText(pgn)}>Copy</Button>
      <GameTree data={data} loadFromHistory={loadFromHistory} />
    </VStack>
  );
};

export default Page;

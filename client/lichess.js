const { exec } = require("child_process");
const { get } = require("https");
const fetch = require("isomorphic-unfetch");
const { Chess } = require("chess.js");
const moveAsSpoken = require("./move-as-spoken.js");
const websocketClient = require("./websocket-client.js");
const SubscriberFactory = require("./subscriber-factory.js");

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const seekPosition = "rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNBQKBNR";

const say = (words, ...others) => {
    const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
    exec(`say -v Fiona '${phraseRaw}'`);
};

let nextMoves = [];

const api = {
    nowPlaying: () => fetch(
        "https://lichess.org/api/account/playing",
        {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
            },
        }
    ).then((r) => r.json()).then(r => r.nowPlaying)
}

const createGame = () => {
    return new Promise(async (resolve, reject) => {

        async function lichessEventStreamHandler(response) {
            let body = "";
            for await (const chunk of response) {
                let text = chunk.toString();
                body += text;
                try {
                    const jsonLine = JSON.parse(body);
                    body = "";
                    console.log(jsonLine)
                    if (jsonLine.type === "gameStart") {
                        resolve()

                    }
                } catch (err) { }
            }
        }

        get(
            `https://lichess.org/api/stream/event`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN}`,
                },
            },
            (response) => lichessEventStreamHandler(response).catch(console.warn)
        );

        const out = await fetch(
            "https://lichess.org/api/challenge/maia9",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rated: true,
                    clock: {
                        limit: 15 * 60,
                        increment: 10
                    }
                })
            }
        ).then((r) => r.json());

        console.log(out)
    })
}

const init = async () => {
    console.log({ token: process.env.TOKEN })

    const alreadyPlaying = await api.nowPlaying()
    if (!alreadyPlaying.length) {
        await createGame()
    }

    const nowPlaying = alreadyPlaying.length ? alreadyPlaying : await api.nowPlaying()
    let nextMoves = []
    console.log({ nowPlaying })

    const { gameId, color } = nowPlaying[0];
    const chess = new Chess();

    async function lichessGameStreamHandler(response) {
        let body = "";
        for await (const chunk of response) {
            let text = chunk.toString();
            body += text;
            try {
                const jsonLine = JSON.parse(body);
                body = "";
                console.log(1, jsonLine)
                handleUpdateMoves(
                    jsonLine.moves || jsonLine.state?.moves,
                    jsonLine.wtime,
                    jsonLine.btime
                );
            } catch (err) { }
        }
    }

    await get(
        `https://lichess.org/api/board/game/stream/${gameId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
            },
        },
        (response) => lichessGameStreamHandler(response).catch(console.warn)
    );

    const handleUpdateMoves = (moves, wtime, btime) => {
        console.log({ moves, wtime, btime })
        chess.reset();
        moves.split(" ").map((move) => {
            chess.move(move, { sloppy: true });
        });

        nextMoves = chess.moves().map((move) => {
            const clone = new Chess(chess.fen());
            clone.move(move);
            return clone.fen().replace(/ .*/, "");
        });

        console.log(chess.ascii());
        console.log(chess.pgn());
        if (chess.turn() === color[0]) {
            say`${moveAsSpoken(chess.history().pop())}`;
        } else {
            if (chess.game_over()) {
                say`game over`;
            } else {
                const remainingTime = color[0] === "w" ? wtime : btime;
                if (remainingTime < 30) {
                    say`${Math.floor(remainingTime / 60000)} minutes`;
                } else {
                    exec("osascript -e beep");
                }
            }
        }
    };

    console.log(nextMoves)

    const match = nextMoves.includes(position);
    if (match) {
        const move = chess.moves()[nextMoves.indexOf(position)];
        chess.move(move);
        const lastMove = chess.history({ verbose: true }).pop();
        const UCIMove = `${lastMove.from}${lastMove.to}`;

        get(`https://lichess.org/api/board/game/${gameId}/move/${UCIMove}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
            },
        });
    }
};

const { subscribers, subscribe } = SubscriberFactory();

subscribe(({ position }) => {
    if (position === startPosition) {
        say`start position`
    } else if (position === seekPosition) {
        say`seek position`
    }
})

websocketClient(message => {
    if (!message.position) { return }
    subscribers.forEach(subscriber => subscriber(message))
}).then(ws => {
    // init()
    console.log('socketed')
})


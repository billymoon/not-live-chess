const { exec } = require("child_process");
const { Chess } = require("chess.js");
const moveAsSpoken = require("./move-as-spoken.js");
const websocketClient = require("./websocket-client.js");
const SubscriberFactory = require("./subscriber-factory.js");

const api = require("./lichess-api.js");

const startPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const seekPosition = "rnbqkbnr/pppppppp/8/8/8/7Q/PPPPPPPP/RNBQKBNR";

const say = (words, ...others) => {
    const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
    console.log(phraseRaw)
    exec(`say -v Fiona '${phraseRaw}'`);
};

const whisper = (words, ...others) => {
    const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
    console.log(phraseRaw)
    exec(`say -v Whisper '${phraseRaw}'`);
};

const { subscribers, subscribe } = SubscriberFactory();

websocketClient(message => {
    if (!message.position) { return }
    subscribers.forEach(subscriber => subscriber(message))
}).then(async ws => {
    const game = {
        id: null,
        chess: new Chess(),
        myColor: null,
        moves: []
    }

    subscribe(data => {
        // when board position changes...
        console.log(JSON.stringify(data))
        if (data.position === seekPosition) {
            api.challenge("maia9");
        } else if (!/K/i.test(data.position) && !game.chess.game_over()) {
            api.resign(game.id);
        }
        const indexOfMove = game.moves.indexOf(data.position)
        if (indexOfMove !== -1) {
            const move = game.chess.moves()[indexOfMove];
            game.chess.move(move);
            const lastMove = game.chess.history({ verbose: true }).pop();
            const UCIMove = `${lastMove.from}${lastMove.to}${lastMove.promotion || ""}`;

            console.log({ UCIMove, move, id: game.id })
    
            api.move(game.id, UCIMove)
        }
    })

    console.log("connected to board")

    const profile = await api.account()

    const nextMoveHandler = message => {
        if (message.type === "gameFull") {
            game.id = message.id
            game.chess.reset()
            if (message.white.id === profile.id) {
                game.myColor = 'w'
            } else if (message.black.id === profile.id) {
                game.myColor = 'b'
            }
            message.state.moves.split(" ").map((move) => {
                game.chess.move(move, { sloppy: true });
            });
        } else if (message.type === "gameState") {
            game.chess.reset()
            message.moves.split(" ").map((move) => {
                game.chess.move(move, { sloppy: true });
            });
        }
        
        game.moves = game.chess.moves().map((move) => {
            const clone = new Chess(game.chess.fen());
            clone.move(move);
            return clone.fen().replace(/ .*/, "");
        });

        console.log(game.moves)
        console.log(game.chess.ascii());
        console.log(game.chess.pgn());
        console.log(game.chess.turn());

        if (game.chess.turn() === game.myColor) {
            const arr = game.chess.history()
            say`${moveAsSpoken(arr[arr.length -1])}`;
        } else {
            const arr = game.chess.history()
            // whisper`${moveAsSpoken(arr[arr.length -1])}`;
            // say`uh huh`
            if (game.chess.game_over()) {
                if (game.chess.in_draw()) {
                    say`game drawn`;
                } else if (game.chess.in_checkmate()) {
                    say`check mate`;
                }
            } else {
                
                // const remainingTime = game.myColor === "w" ? message.wtime : message.btime;
                
                // if (remainingTime < 700000) {
                    // say`${Math.floor(remainingTime / 60000)} minutes`;
                // } else {
                    exec("osascript -e beep");
                // }
            }
        }
    }
    
    await api.streamEvent(message => {
        if (message.type === "gameStart") {
            console.log({ game: `https://lichess.org/${message.game.id}` })
            api.gameStream(message.game.id, nextMoveHandler)
        }
    })

    console.log("listening for games")
})

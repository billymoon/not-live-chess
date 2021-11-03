const fetch = require("isomorphic-unfetch");
const { get } = require("https");

const nowPlaying = () => fetch(
    "https://lichess.org/api/account/playing",
    {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
        },
    }
).then((r) => r.json()).then(r => r.nowPlaying)

const account = () => fetch(
    "https://lichess.org/api/account",
    {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
        },
    }
).then((r) => r.json())

const streamEvent = callback => {
    async function lichessEventStreamHandler(response) {
        let body = "";
        for await (const chunk of response) {
            let text = chunk.toString();
            body += text;
            try {
                const jsonLine = JSON.parse(body);
                body = "";
                callback(jsonLine)
            } catch (err) { }
        }
    }

    return get(
        `https://lichess.org/api/stream/event`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
            },
        },
        (response) => lichessEventStreamHandler(response).catch(console.warn)
    );
}

const gameStream = (gameId, callback) => {
    async function lichessGameStreamHandler(response) {
        let body = "";
        for await (const chunk of response) {
            let text = chunk.toString();
            body += text;
            try {
                const jsonLine = JSON.parse(body);
                body = "";
                callback(jsonLine)
            } catch (err) { }
        }
    }

    return get(
        `https://lichess.org/api/board/game/stream/${gameId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`,
            },
        },
        (response) => lichessGameStreamHandler(response).catch(console.warn)
    );
}

const move = (gameId, UCIMove) => get(`https://lichess.org/api/board/game/${gameId}/move/${UCIMove}`, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
    },
})

const resign = (gameId) => get(`https://lichess.org/api/board/game/${gameId}/resign`, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
    },
})

const challenge = async (user) => await fetch(
    `https://lichess.org/api/challenge/${user}`,
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
).then((r) => r.json())

module.exports = {
    challenge,
    nowPlaying,
    streamEvent,
    gameStream,
    account,
    move,
    resign
}
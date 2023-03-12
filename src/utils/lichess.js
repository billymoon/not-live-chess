const fetch = require("isomorphic-unfetch");

export default ({ token }) => {
  const nowPlaying = () =>
    fetch("https://lichess.org/api/account/playing", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((r) => r.nowPlaying);

  const account = () =>
    fetch("https://lichess.org/api/account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((r) => r.json());

  // const streamEvent = callback => {
  //     async function lichessEventStreamHandler(response) {
  //         let body = "";
  //         for await (const chunk of response) {
  //             let text = chunk.toString();
  //             body += text;
  //             try {
  //                 const jsonLine = JSON.parse(body);
  //                 body = "";
  //                 callback(jsonLine)
  //             } catch (err) { }
  //         }
  //     }

  //     return get(
  //         `https://lichess.org/api/stream/event`,
  //         {
  //             headers: {
  //                 Authorization: `Bearer ${token}`,
  //             },
  //         },
  //         (response) => lichessEventStreamHandler(response).catch(console.warn)
  //     );
  // }

  const gameStream = (gameId, callback) => {
    const textDecoder = new TextDecoder();
    return fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      async function readAllChunks(readableStream) {
        const reader = readableStream.getReader();
        const chunks = [];

        let done, value;
        while (!done) {
          ({ value, done } = await reader.read());
          if (done) {
            return chunks;
          }
          chunks.push(value);
          const decoded = textDecoder.decode(value);
          if (decoded) {
            try {
              callback(JSON.parse(decoded));
            } catch (err) {
              // // ignore any non json messages from lichess api
              // console.warn(err)
            }
          }
        }
      }

      readAllChunks(response.body);
    });
  };

  const move = (gameId, UCIMove) =>
    fetch(`https://lichess.org/api/board/game/${gameId}/move/${UCIMove}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  const resign = (gameId) =>
    fetch(`https://lichess.org/api/board/game/${gameId}/resign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  const challenge = async (user) =>
    await fetch(`https://lichess.org/api/challenge/${user}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rated: true,
        clock: {
          limit: 15 * 60,
          increment: 10,
        },
      }),
    }).then((r) => r.json());

  const getUserGames = async ({
    user,
    since = "1970",
    until = new Date().toISOString(),
    speed = null,
    max = null,
  }) => {
    console.log(
      `https://lichess.org/api/games/user/${user}?pgnInJson=true&sort=dateAsc&since=${
        new Date(since) * 1
      }&until=${new Date(until) * 1}&perfType=${speed}&max=${max}`
    );

    const data = await fetch(
      `https://lichess.org/api/games/user/${user}?pgnInJson=true&sort=dateAsc&since=${
        new Date(since) * 1
      }&perfType=${speed}&max=${max}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/x-ndjson",
        },
      }
    )
      .then((r) => r.text())
      .catch(console.log);

    return data;
  };

  const getUserCurrentGame = async (user) => {
    const data = await fetch(
      `https://lichess.org/api/user/${user}/current-game?pgnInJson=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/x-ndjson",
        },
      }
    ).then((r) => r.text());

    return data;
  };

  return {
    getUserGames,
    getUserCurrentGame,
    challenge,
    nowPlaying,
    // streamEvent,
    gameStream,
    account,
    move,
    resign,
  };
};

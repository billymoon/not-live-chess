const fetch = require("isomorphic-unfetch");

const fetchNdjsonArray = async (r) =>
  (await r.text())
    .split("\n")
    .filter((x) => !!x)
    .map(JSON.parse);

const fetchPlainText = (r) => r.text(); //.then((d) => console.log(d) || d);

const ApiFactory =
  (token) =>
  (
    urlPath,
    { headers, ...extraProps } = {},
    responseHandler = (r) => r.json().then((d) => console.log(d) || d)
  ) =>
  async (...args) =>
    fetch(
      `https://lichess.org/${
        typeof urlPath === "function" ? await urlPath(...args) : urlPath
      }`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        ...extraProps,
      }
    ).then(responseHandler);

export default ({ token }) => {
  const AuthenticatedApi = ApiFactory(token);
  const UnAuthenticatedApi = ApiFactory();
  const account = AuthenticatedApi("api/account");
  const playing = AuthenticatedApi("api/account/playing", {}, (r) =>
    r.json().then((d) => d.nowPlaying)
  );

  const userFromToken = (() => {
    const cache = {};
    return async (token) =>
      cache[token] || (cache[token] = (await account()).id);
  })();

  const getMyGames = AuthenticatedApi(
    async ({ since, speed, max }) =>
      `api/games/user/${await userFromToken()}?pgnInJson=true&sort=dateAsc&since=${
        new Date(since) * 1
      }&perfType=${speed}&max=${max}`,
    { headers: { Accept: "application/x-ndjson" } },
    fetchNdjsonArray
  );

  const getUserGames = AuthenticatedApi(
    async (user, { since, speed, max }) =>
      `api/games/user/${user}?pgnInJson=true&sort=dateAsc&since=${
        new Date(since) * 1
      }&perfType=${speed}&max=${max}`,
    { headers: { Accept: "application/x-ndjson" } },
    fetchNdjsonArray
  );

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
  const StreamFactory = (urlPath, callback) =>
    AuthenticatedApi(urlPath, {}, (response) => {
      const reader = response.body.getReader();
      const readNext = () => {
        reader.read().then(({ done, value }) => {
          if (!done) {
            const messageString = Array.from(value)
              .map((charcode) => String.fromCharCode(charcode))
              .join("");
            if (messageString.trim().length) {
              callback(JSON.parse(messageString));
            }
            readNext();
          }
        });
      };

      readNext();
    })();

  const streamEvents = (callback) =>
    StreamFactory("api/stream/event", callback);

  const gameStream = (gameId, callback) =>
    StreamFactory(() => `api/board/game/stream/${gameId}`, callback);

  const move = AuthenticatedApi(
    (gameId, UCIMove) => `api/board/game/${gameId}/move/${UCIMove}`,
    { method: "POST" }
  );
  const resign = AuthenticatedApi(
    (gameId) => `api/board/game/${gameId}/resign`,
    {
      method: "POST",
    }
  );

  const challenge = AuthenticatedApi((user) => `api/challenge/${user}`, {
    method: "POST",
    body: JSON.stringify({
      rated: true,
      clock: { limit: 15 * 60, increment: 10 },
    }),
    headers: { "Content-Type": "application/json" },
  });

  const getUserCurrentGame = AuthenticatedApi(
    (user) => `api/user/${user}/current-game?pgnInJson=true`,
    { headers: { Accept: "application/x-ndjson" } },
    fetchNdjsonArray
  );

  const getDailyPuzzle = AuthenticatedApi(
    () => `api/puzzle/daily`,
    { headers: { Accept: "application/x-ndjson" } },
    fetchNdjsonArray
  );

  const getStudy = UnAuthenticatedApi(
    (studyId, { chapter }) =>
      `study/${studyId}${chapter ? `/${chapter}` : ""}.pgn`,
    {
      headers: { Accept: "application/x-chess-pgn" },
    },
    fetchPlainText
  );

  return {
    getDailyPuzzle,
    getStudy,
    getMyGames,
    getUserGames,
    getUserCurrentGame,
    challenge,
    playing,
    streamEvents,
    gameStream,
    account,
    move,
    resign,
  };
};

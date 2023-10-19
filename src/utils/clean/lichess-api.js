import fetch from "isomorphic-unfetch";

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
      `https://lichess.org/${token ? "api/" : ""}${
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
  const account = AuthenticatedApi("account");
  const playing = AuthenticatedApi("account/playing", {}, (r) =>
    r.json().then((d) => d.nowPlaying)
  );

  const userFromToken = (() => {
    const cache = {};
    return async (token) =>
      cache[token] || (cache[token] = (await account()).id);
  })();

  const getUserGames = AuthenticatedApi(
    async (user, { since, speed, max }) =>
      `games/user/${user}?pgnInJson=true&sort=dateAsc&since=${
        new Date(since) * 1
      }&perfType=${speed}&max=${max}`,
    { headers: { Accept: "application/x-ndjson" } },
    fetchNdjsonArray
  );

  const getMyGames = async (options) =>
    getUserGames(await userFromToken(), options);

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
  //         `https://lichess.org/stream/event`,
  //         {
  //             headers: {
  //                 Authorization: `Bearer ${token}`,
  //             },
  //         },
  //         (response) => lichessEventStreamHandler(response).catch(console.warn)
  //     );
  // }
  const StreamFactory = (urlPath, callback, processor = (i) => i) =>
    AuthenticatedApi(urlPath, {}, (response) => {
      const reader = response.body.getReader();
      const readNext = () => {
        reader.read().then(({ done, value }) => {
          if (!done) {
            const messageString = Array.from(value)
              .map((charcode) => String.fromCharCode(charcode))
              .join("");
            if (messageString.trim().length) {
              try {
                const parsed = JSON.parse(processor(messageString.trim()));
                callback(parsed);
              } catch (err) {
                console.log(err);
                console.log({ messageString, value });
              }
            }
            readNext();
          }
        });
      };

      readNext();
    })();

  const streamEvents = (callback) => StreamFactory("stream/event", callback);

  const gameStream = (gameId, callback) =>
    StreamFactory(() => `board/game/stream/${gameId}`, callback);

  const move = AuthenticatedApi(
    (gameId, UCIMove) => `board/game/${gameId}/move/${UCIMove}`,
    { method: "POST" }
  );
  const resign = AuthenticatedApi((gameId) => `board/game/${gameId}/resign`, {
    method: "POST",
  });

  const challenge = AuthenticatedApi((user) => `challenge/${user}`, {
    method: "POST",
    body: JSON.stringify({
      rated: true,
      time: 15,
      increment: 10,
      variant: "standard",
      color: "random",
      // ratingRange: "1900-2200",
    }),
    headers: { "Content-Type": "application/json" },
  });

  const seek = AuthenticatedApi((user) => `board/seek`, {
    method: "POST",
    body: JSON.stringify({
      rated: true,
      // clock: { limit: 15 * 60, increment: 10 },
      time: 15,
      increment: 10,
      variant: "standard",
    }),
    headers: { "Content-Type": "application/json" },
  });

  const getUserCurrentGame = AuthenticatedApi(
    (user) => `user/${user}/current-game?pgnInJson=true`,
    // { headers: { Accept: "application/x-ndjson" } },
    { headers: { Accept: "application/json" } },
    fetchNdjsonArray
  );

  const getMyCurrentGame = async () =>
    getUserCurrentGame(await userFromToken());

  const getDailyPuzzle = AuthenticatedApi(
    () => `puzzle/daily`,
    { headers: { Accept: "application/x-ndjson" } },
    fetchNdjsonArray
  );

  // const getFollowing = AuthenticatedApi(
  //   () => `rel/following`,
  //   { headers: { Accept: "application/x-ndjson" } },
  //   fetchNdjsonArray
  // );
  // const getFollowing = (callback) =>
  //   StreamFactory(() => `rel/following`, callback, str => JSON.stringify(str.split("\n").map(JSON.parse)));

  const getFollowing = (callback) =>
    AuthenticatedApi("rel/following", {}, (response) => {
      console.log(1, response.body);
      const reader = response.body.getReader();
      const readNext = () => {
        reader.read().then(({ done, value }) => {
          console.log({ done, value });
          if (!done) {
            const messageString = Array.from(value)
              .map((charcode) => String.fromCharCode(charcode))
              .join("");
            if (messageString.trim().length) {
              try {
                const parsed = JSON.parse(processor(messageString.trim()));
                callback(parsed);
              } catch (err) {
                console.log(err);
                console.log({ messageString, value });
              }
            }
            readNext();
          }
        });
      };

      readNext();
    });

  const getStudy = UnAuthenticatedApi(
    (studyId, { chapter }) =>
      `study/${studyId}${chapter ? `/${chapter}` : ""}.pgn`,
    {
      headers: { Accept: "application/x-chess-pgn" },
    },
    fetchPlainText
  );

  const getStudies = UnAuthenticatedApi(
    (user) => `study/by/${user}/export.pgn`,
    { headers: { Accept: "application/x-chess-pgn" } },
    fetchPlainText
  );

  return {
    getDailyPuzzle,
    getStudy,
    getStudies,
    getUserGames,
    getMyGames,
    getUserCurrentGame,
    getMyCurrentGame,
    challenge,
    seek,
    playing,
    streamEvents,
    gameStream,
    getFollowing,
    account,
    move,
    resign,
  };
};

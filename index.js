require = require("esm")(module);
const next = require("next");
const {
  serverRuntimeConfig: { dev, port, wssOnly },
} = require("./next.config.js");
const server = require("./src/server/server.js").default;

if (wssOnly) {
  server({ port, wssOnly });
} else {
  const app = next({ dev, dir: __dirname });

  const requestHandler = app.getRequestHandler();

  app.prepare().then(() => {
    server({ port, requestHandler });
  });
}

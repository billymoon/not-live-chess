import next from "next";
import nextConfig from "./next.config.js";
import server from "./src/server/server.js";

const { serverRuntimeConfig, publicRuntimeConfig } = nextConfig;
const { port, wssOnly } = serverRuntimeConfig;
const { dev } = publicRuntimeConfig;

if (wssOnly) {
  server({ port, wssOnly });
} else {
  // const app = next({ dev, dir: __dirname });
  const app = next({ dev });

  const requestHandler = app.getRequestHandler();

  app.prepare().then(() => {
    server({ port, requestHandler });
  });
}

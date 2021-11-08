import getConfig from "next/config";
import websocketClient from "./websocket-client.js";

const { publicRuntimeConfig } = getConfig();

const nextjsWebsocketClient = (callback) =>
  websocketClient(
    {
      location: publicRuntimeConfig.websocketUrl || window.location.toString(),
    },
    callback
  );

export default nextjsWebsocketClient;

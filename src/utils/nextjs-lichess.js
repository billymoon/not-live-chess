import getConfig from "next/config";
import lichess from "./lichess.js";

const { publicRuntimeConfig } = getConfig();

const nextjsLichess = lichess({ token: publicRuntimeConfig.lichessToken });

export default nextjsLichess;

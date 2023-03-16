import getConfig from "next/config";
// import { default as legacyLichess } from "./lichess.js";
import LichessApi from "./clean/lichess-api";

const { publicRuntimeConfig } = getConfig();

// const nextjsLichess = legacyLichess({
//   token: publicRuntimeConfig.lichessToken,
// });

export const lichess = LichessApi({ token: publicRuntimeConfig.lichessToken });

// export default nextjsLichess;

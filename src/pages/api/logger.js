import logger from "~/server/logger.js";

const myLogger = logger.child({
  logger: {
    from: "client-side",
    session: new Date() * 1,
  },
});

const handler = (req, res) => {
  myLogger.log({
    level: "info",
    message: "front-end-log",
    ...req.body,
  });
  res.send({ ok: true });
};

export default handler;

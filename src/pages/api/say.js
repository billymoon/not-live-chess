import say from "~/utils/say.js";

const handler = (req, res) => {
  say`${req.query.what}`;
  res.send({ awesome: "stuff" });
};

export default handler;

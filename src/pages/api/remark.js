import { exec } from "child_process";
import { FONT_SIZE } from "../../utils/remarkable.js";

const sh = (command) =>
  exec(command, (err, stdout, stderr) => console.log(stdout));

const display = (input) => {
  let count = 1;
  return `
@fontsize ${FONT_SIZE}
@justify left
@timeout 1
${input
  .trim()
  .split("\n")
  .map((line) => `label 50 ${count++ * FONT_SIZE} 50 80 ${line}`)
  .join("\n")}
`.trim();
};

const handler = (req, res) => {
  console.log(req.body);
  sh(`
ssh remarkable systemctl stop xochitl
cat <<DELIMITER | ssh remarkable ./simple
${display(req.body)}
DELIMITER
`);
  res.send({ awesome: "stuff" });
};

export default handler;

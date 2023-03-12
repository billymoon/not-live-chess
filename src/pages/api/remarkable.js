import { exec } from "child_process";
import { FONT_SIZE } from "../../utils/remarkable.js";
import ChessImageGenerator from "chess-image-generator";

const sh = (command) =>
  exec(command, (err, stdout, stderr) => console.log(stdout));

const display = (input, fontsize = FONT_SIZE) => {
  let count = 1;
  const content = `
@fontsize ${fontsize}
@justify left
@timeout 1
${input
  .trim()
  .split("\n")
  .map((line) => `label 50 ${count++ * fontsize} 50 80 ${line}`)
  .join("\n")}
`.trim();

  sh(`
ssh remarkable systemctl stop xochitl
cat <<DELIMITER | ssh remarkable ./simple
${content}
DELIMITER
`);
};

const displayPosition = (
  position,
  { highlightSquares, ...imageGeneratorOptions }
) => {
  const imageGenerator = new ChessImageGenerator({
    padding: [288, 44, 268, 44],
    size: 1316,
    light: "#ccc",
    dark: "#aaa",
    highlight: "#0007",
    ...imageGeneratorOptions,
  });

  console.log(position);
  const fen = `${position} w KQkq - 0 1`;
  imageGenerator.loadFEN(fen);
  if (highlightSquares) {
    imageGenerator.highlightSquares(highlightSquares);
  }
  imageGenerator.generatePNG("mirror.png");
  sh(`
ssh remarkable systemctl stop xochitl
scp mirror.png remarkable:/home/root/mirror.png
ssh remarkable /home/root/remarkable-splash /home/root/mirror.png
`);
};

const handler = (req, res) => {
  const body = req.body;
  if (body.text) {
    display(body.text, body.fontsize);
  } else if (body.position) {
    const { position, ...options } = req.body;
    displayPosition(body.position, options);
  }
  res.send({ echo: body });
};

export default handler;

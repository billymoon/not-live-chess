const { exec } = require("child_process");

const say = (words, ...others) => {
  const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
  exec(`say '${phraseRaw}'`);
};

module.exports = {
  say
}
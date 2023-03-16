const { exec } = require("child_process");
const { Client } = require("ssh2");

// osascript -e 'output volume of (get volume settings)'
// say "[[volm 0.1]] this is not so loud"
const getSSH = (config) => {
  const ssh2 = new Client();

  return new Promise((resolve, reject) => {
    const sshExec = async (command) => {
      return new Promise((resolve, reject) => {
        ssh2.exec(command, (err, stream) => {
          if (err) throw err;
          let stdout = [];
          let stderr = [];
          // let combined = []
          stream
            .on("close", (code, signal) => {
              resolve(stdout.join(""));
              // resolve(combined.join(''));
              // connection.end();
            })
            .on("data", (data) => {
              stdout.push(data);
              // combined.push(data)
            })
            .stderr.on("data", (data) => {
              stderr.push(data);
              // combined.push(data)
            });
        });
      });
    };

    ssh2
      .on("ready", () => {
        resolve(sshExec);
      })
      .connect(config);
  });
};

const execCommand = (() => {
  let sshExec;
  return async (command) => {
    console.log(command);
    if (process.env.SSH_CONFIG) {
      sshExec = sshExec || (await getSSH(JSON.parse(process.env.SSH_CONFIG)));
      return sshExec(command);
    } else {
      return new Promise((resolve, reject) =>
        exec(command, (err, r) => resolve(r.toString("utf8")))
      );
    }
  };
})();

// SSH_CONFIG='{"host":"minimac.itaccess.org","username":"admin","password":"top-secret-password"}' nodemon ssh2
const say = async (words, ...others) => {
  const phraseRaw = words.map((word, i) => word + (others[i] || "")).join("");
  await execCommand(`osascript -e "set Volume 0.4"`);
  await execCommand(`say -v Fiona '${phraseRaw}'`);
  // await execCommand(`say '${phraseRaw}'`);
};

module.exports = say;

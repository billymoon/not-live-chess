const loggerPackage = process.env.SOCK
  ? "./dgt-logger-socket/client"
  : process.env.MOCK
  ? "./dgt-logger-mock/server"
  : "./dgt-logger";

module.exports = require(loggerPackage)
const dgtMethods = [
  {
    methodName: "reset",
    messageTypeCode: "40",
  },
  {
    methodName: "mode",
    messageTypeCode: "44",
  },
  {
    methodName: "getBoard",
    messageTypeCode: "42",
    returnDataLength: 67,
    returnDataHandler: (data) => {
      const boardArray = data.slice(3);
      const out = [];
      for (let i = 0; i < boardArray.length; i++) {
        out[i] = boardArray.readInt8(i);
      }
      return out;
    },
  },
  {
    methodName: "getSerialNumber",
    messageTypeCode: "45",
    returnDataLength: 8,
    returnDataHandler: (data) => data.toString("ascii").replace(/[^0-9]/g, ""),
  },
  {
    methodName: "getVersion",
    messageTypeCode: "4D",
    returnDataLength: 5,
    returnDataHandler: (data) => data.readInt8(3) + "." + data.readInt8(4),
  },
];

module.exports = dgtMethods
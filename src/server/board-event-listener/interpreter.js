import fenish from "~/utils/fenish.js";

const interpreter = (type, message) => {
  if (type === 142) {
    return {
      move: message[1] ? "drop" : "lift",
      piece: message[1] ? fenish([message[1]]) : null,
    };
  } else if (type === 147) {
    return { version: `${message[0]}.${message[1]}` };
  } else if (type === 145) {
    return {
      serialNumber: message.map((i) => String.fromCharCode(i)).join(""),
    };
  } else if (type === 134) {
    return { position: fenish(message) };
  } else if (type === 160) {
    const percent = message[0];
    const charging = message[8] === 1;
    return { charge: { percent, charging } };
  } else {
    return { unknown: type };
  }
};

export default interpreter;

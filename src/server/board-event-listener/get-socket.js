import SerialPort from "serialport";

const getSocketName = async () => {
  const allPorts = await SerialPort.list();
  const sockets = allPorts.reduce((memo, port) => {
    if (/\btty\.DGT_/.test(port.path)) {
      memo.push(port.path);
    }
    return memo;
  }, []);
  if (sockets.length > 1) {
    throw Error("More than one matching socket - unhandled feature");
  } else if (sockets.length === 0) {
    throw Error("No matching sockets - connect DGT board");
  } else {
    return sockets[0];
  }
};

const openSerialPort = async (serialport) => {
  return new Promise(async (resolve, reject) => {
    let tries = 20;
    while (tries--) {
      if (serialport.isOpen || serialport.opening) {
        resolve();
      } else {
        serialport.open((err) => {
          if (!err) {
            resolve();
          } else {
            console.log(err);
          }
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    reject();
  });
};

const getSocket = async (onOpen, onData, onError) => {
  // TODO: fix case where sometimes two connections cause running twice at same time
  const socketName = await getSocketName();
  const serialport = new SerialPort(socketName, {
    baudRate: 9600,
    autoOpen: false,
  });
  serialport.on("open", onOpen);
  serialport.on("error", onError);
  serialport.on("data", onData);
  await openSerialPort(serialport);
  return serialport;
};

export default getSocket;

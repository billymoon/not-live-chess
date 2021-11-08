const DGT_SEND_RESET = "40";
const DGT_SEND_BRD = "42";
const DGT_SEND_UPDATE_BRD = "44";
const DGT_RETURN_SERIALNR = "45";
const DGT_SEND_BATTERY_STATUS = "4C";
const DGT_SEND_VERSION = "4D";

const boardApi = (serialport) => {
  const sendMessage = (message) => {
    serialport.write(Buffer.from(message, "hex"));
  };
  const init = () => {
    sendMessage(DGT_SEND_RESET);
    sendMessage(DGT_SEND_UPDATE_BRD);
  };

  const position = () => {
    sendMessage(DGT_SEND_BRD);
  };

  const battery = () => {
    sendMessage(DGT_SEND_BATTERY_STATUS);
  };

  return {
    init,
    position,
    battery,
  };
};

export default boardApi;

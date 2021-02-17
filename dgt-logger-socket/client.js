const WebSocket = require('ws');

module.exports = async () => {
  const ws = new WebSocket('ws://127.0.0.1:1983');

  let infoData
  const subscribers = [];

  const subscribe = (callback) => {
    if (subscribers.indexOf(callback) === -1) {
      subscribers.push(callback);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(subscribers.indexOf(callback), 1);
        }
      };
    }
  };

  let loaded = false
  await new Promise((resolve) => {
    ws.on('message', function incoming(data) {
      infoData = JSON.parse(data)
      if (!loaded) {
        loaded = true
        resolve(infoData)        
      }
      subscribers.forEach((subscriber) => subscriber(infoData));
    });    
  })

  return {
    info: () => infoData,
    subscribe
  }
}
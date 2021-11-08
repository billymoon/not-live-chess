const SubscriberFactory = () => {
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

  const broadcast = (message) =>
    subscribers.forEach((subscriber) => subscriber(message));

  return {
    subscribers,
    subscribe,
    broadcast,
  };
};

export default SubscriberFactory;

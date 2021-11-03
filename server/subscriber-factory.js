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

  return {
    subscribers,
    subscribe,
  };
};

module.exports = SubscriberFactory
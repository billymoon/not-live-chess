let chunkTracker = [];
const UnchunkerFactory = (callback) => {
  const checkNextMessage = () => {
    if (chunkTracker.length >= 3) {
      const [x, y, length] = chunkTracker;

      if (length && chunkTracker.length >= length) {
        const message = chunkTracker.slice(0, length);
        chunkTracker = chunkTracker.slice(length);
        callback(message);
        checkNextMessage();
      }
    }
  };

  return (chunk) => {
    chunkTracker = [...chunkTracker, ...chunk];
    checkNextMessage();
  };
};

module.exports = UnchunkerFactory;

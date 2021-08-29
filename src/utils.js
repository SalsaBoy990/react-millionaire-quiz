// timeout func wrapper
export const delay = (duration, callback) => {
  setTimeout(() => {
    callback();
  }, duration);
};

import EventEmitter from 'eventemitter2';

export const eventEmitter = new EventEmitter({
  maxListeners: 10,
});

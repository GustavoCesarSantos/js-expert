const Event = require("events");
const event = new Event();
const eventName = "counter";
event.on(eventName, (msg) => console.log("counter updated", msg));
const myCounter = {
  counter: 0,
};
const proxy = new Proxy(myCounter, {
  set: (target, propertyKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertyKey] });
    target[propertyKey] = newValue;
    return true;
  },
  get: (object, prop) => {
    return object[prop];
  },
});

module.exports = proxy;

const Publisher = function () { };
Publisher.prototype.addEvent = function (eventName) {
    this.hasOwnProperty(eventName) || (this[eventName] = []);
};
Publisher.prototype.trigger = function (eventName, param) {
    this[eventName].map(subscriber => { subscriber.run(param); });
    return this;
};
const Subscriber = function (callback, publisherObj) {
    this.run = callback.bind(this);
    this.publisher = publisherObj;
};
Subscriber.prototype.subscribe = function (eventName) {
    const subscribers = this.publisher[eventName];
    subscribers.indexOf(this) === -1 && subscribers.push(this);
    return this;
};
Subscriber.prototype.unSubscribe = function (eventName) {
    const subscribers = this.publisher[eventName]
        , index = subscribers.indexOf(this);
    index >= 0 && subscribers.splice(index, 1);
    return this;
};
const ObservablePattern = function (eventsNameArray) {
    this.publisher = new (Publisher)();
    if (eventsNameArray.constructor === Array)
        eventsNameArray.map(eventName => {
            this.publisher.addEvent(eventName);
        });
};
ObservablePattern.prototype.createSubscriber = function (callback) {
    return new (Subscriber)(callback, this.publisher);
};
export default ObservablePattern;

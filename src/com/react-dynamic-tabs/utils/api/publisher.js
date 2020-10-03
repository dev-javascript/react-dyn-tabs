const Publisher = function (subscribers) {
    subscribers = subscribers || [];
    this.subscribers = subscribers;
};
Publisher.prototype.unSubscribe = function (fn) {
    this.subscribers.splice(this.subscribers.indexOf(fn), 1); return this;
};
Publisher.prototype.subscribe = function (fn) { this.subscribers.push(fn); return this; };
Publisher.prototype.onceSubscribe = function (fn) {
    const _fn = param => {
        fn(param);
        this.unSubscribe(_fn);
    };
    return this.subscribe(_fn);
};
Publisher.prototype.trigger = function (param) {
    const _subscribers = [...this.subscribers];
    _subscribers.map(subscriber => {
        subscriber(param);
    });
    return this;
};
export default Publisher;

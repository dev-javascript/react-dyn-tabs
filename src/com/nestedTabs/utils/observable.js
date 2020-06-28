const Publisher = function (proxyFunction, actions) {
    this.subscribers = [];
    this.actions = actions = [];
    this.proxyFn = proxyFunction || function () { return true; };
};
Publisher.prototype.trigger = function (actionName, param, extraParam) {
    this.subscribers.map(consumer => {
        this.proxyFn.call(cosumer, param, extraParam) &&
            consumer.actions[actionName].apply(consumer, [param]);
    });
};
const Subscriber = function (actionsObj) {
    this.actions = actionsObj;
};
Subscriber.prototype.subscribe = function (publisher) {
    publisher.subscribers.push(this);
};
Subscriber.prototype.unSubscribe = function (publisher) {
    const ps = publisher.subscribers;
    ps.subscribers.splice(ps.indexOf(this), 1);
};
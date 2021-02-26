const Pub_Sub = function (subscribers) {
    this.events = {
        beforeSwitchTab: []
        , onChange: []
        , onLoad: []
        , onDestroy: []
    };
};
Pub_Sub.prototype.unSubscribe = function (eventName, fn) {
    this.events[eventName].splice(this.events[eventName].indexOf(fn), 1);
    return this;
};
Pub_Sub.prototype.subscribe = function (eventName, fn) {
    this.events[eventName].push(fn);
    return this;
};
Pub_Sub.prototype.onceSubscribe = function (eventName, fn) {
    const _fn = param => {
        fn(param);
        this.unSubscribe(eventName, _fn);
    };
    return this.subscribe(eventName, _fn);
};
Pub_Sub.prototype.trigger = function (eventName, param) {
    const _subscribers = [...this.events[eventName]];
    _subscribers.map(subscriber => {
        subscriber(param);
    });
    return this;
};
export default Pub_Sub;

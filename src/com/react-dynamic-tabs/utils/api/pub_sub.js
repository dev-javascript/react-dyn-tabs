const Pub_Sub = function (subscribers) {
    this.publishers = {
        beforeSwitchTab: []
        , onChange: []
        , onLoad: []
        , onDestroy: []
        , onOpen: []
        , onClose: []
        , onSelect: []
    };
};
Pub_Sub.prototype.unSubscribe = function (publisherName, fn) {
    this.publishers[publisherName].splice(this.publishers[publisherName].indexOf(fn), 1);
    return this;
};
Pub_Sub.prototype.subscribe = function (publisherName, fn) {
    this.publishers[publisherName].push(fn);
    return this;
};
Pub_Sub.prototype.oneSubscribe = function (publisherName, fn) {
    const _fn = param => {
        fn(param);
        this.unSubscribe(publisherName, _fn);
    };
    return this.subscribe(publisherName, _fn);
};
Pub_Sub.prototype.trigger = function (publisherName, param, context) {
    const _subscribers = [...this.publishers[publisherName]];
    _subscribers.map(subscriber => {
        context ? subscriber.call(context, param) : subscriber(param);
    });
    return this;
};
export default Pub_Sub;

import helper from '../helper.js';
const Pub_Sub = function () {
    this._publishers = {
        onChange: []
        , onLoad: []
        , onDestroy: []
        , onOpen: []
        , onClose: []
        , onSelect: []
        , onInit: []
        , onFirstSelect: []
    };
};
//unSubscribe
Pub_Sub.prototype.off = function (publisherName, fn) {
    if (typeof fn === 'function' && this._publishers.hasOwnProperty(publisherName)) {
        const _index = this._publishers[publisherName].indexOf(fn);
        _index >= 0 && this._publishers[publisherName].splice(_index, 1);
    }
    return this;
};
//subscribe
Pub_Sub.prototype.on = function (publisherName, fn) {
    if (typeof fn === 'function' && this._publishers.hasOwnProperty(publisherName))
        this._publishers[publisherName].push(fn);
    return this;
};
//oneSubscribe
Pub_Sub.prototype.one = function (publisherName, fn) {
    if (typeof fn === 'function' && this._publishers.hasOwnProperty(publisherName)) {
        const _fn = param => {
            fn(param);
            this.off(publisherName, _fn);
        };
        return this.on(publisherName, _fn);
    }
    return this;
};
helper.setNoneEnumProps(Pub_Sub.prototype, {
    trigger: function (publisherName, context, ...param) {
        context = context || null;
        const result = [];
        const _subscribers = [...this._publishers[publisherName]];
        _subscribers.map(subscriber => {
            result.push(subscriber.apply(context, param));
        });
        return result;
    }
});
export default Pub_Sub;

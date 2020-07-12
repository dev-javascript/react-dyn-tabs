const DefaultOptions = function (deps) {
    const { defaultTabObj, defaultClasses, defaultEvents, eventModes } = deps;
    this.option = {};
    this._data = {};
    this._data_allTabs = {};
    this._data_activeTabId = '';
    this._data_openTabsId = [];
    this._events = Object.assign({}, defaultEvents);
    this._classNames = Object.assign({}, defaultClasses);
    this._switchTabEventMode = 'click';
    this._closeTabEventMode = 'click';
    this._getDefaultTabObj = () => Object.assign({}, defaultTabObj);
    this._eventModes = eventModes;
};
DefaultOptions.prototype._checkArrayType = function (value, path) {
    if (value.constructor !== Array) throw `passed ${path} property must be an Array`;
};
DefaultOptions.prototype._checkObjectType = function (value, path) {
    if ((typeof value !== 'object') || (value === null)) throw `type of the passed ${path} property must be an object`;
};
DefaultOptions.prototype._checkEventMode = function (value, path) {
    if (this._eventModes.indexOf(value) == -1)
        throw `can not set ${value} on ${path}. possible values are 'mousedown', 'mouseenter', 'click', 'mouseup'`;
    return value;
};
DefaultOptions.prototype._checkStringType = function (value, path) {
    if (typeof value !== 'string') throw `type of the passed ${path} property must be a string`;
};
DefaultOptions.prototype._checkValidStringType = function (value, path) {
    if (!(typeof value === 'string' && (value !== '')))
        throw `type of the passed ${path} property must be a valid string`;
};
DefaultOptions.prototype._checkFunctionType = function (value, path) {
    if (typeof value !== 'function') throw `type of the passed ${path} property must be a function`;
};
DefaultOptions.prototype._defineClassNames = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._classNames; },
        set(obj) {
            that._checkObjectType(obj, path);
            const reducer = function (acc, key) {
                let className = obj[key];
                that._checkStringType(className, path + '.' + key);
                const defaultClass = that._defaultClasses[key];
                if (defaultClass) {
                    className = className.trim();
                    if (className === defaultClass)
                        acc[key] = className;
                    else
                        acc[key] = className ? (defaultClass + ' ' + className) : defaultClass;
                }
                return acc;
            };
            Object.keys(obj).reduce(reducer, that._classNames);
        }
    });
    return this;
};
DefaultOptions.prototype._defineEvents = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._events; },
        set(value) {
            that._checkObjectType(value, path);
            const reducer = function (acc, item) {
                if (that._events.hasOwnProperty(item)) {
                    let ev = value[item];
                    that._checkFunctionType(ev, path + '.' + item);
                    acc[item] = ev;
                }
                return acc;
            };
            Object.keys(value).reduce(reducer, that._events);
        }
    });
    return this;
};
DefaultOptions.prototype._defineSwitchTabEventMode = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._switchTabEventMode; },
        set(value) { that._switchTabEventMode = that._checkEventMode(value, path); }
    });
    return this;
};
DefaultOptions.prototype._defineCloseTabEventMode = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._closeTabEventMode; },
        set(value) { that._closeTabEventMode = that._checkEventMode(value, path); }
    });
    return this;
};
DefaultOptions.prototype._defineData = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._data; },
        set(value) {
            that._checkObjectType(value, path);
            const reducer = function (acc, item) {
                acc[item] = value[item];
                return acc;
            };
            Object.keys(value).reduce(reducer, that._data);
        }
    });
    return this;
};
DefaultOptions.prototype._defineData_allTabs = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._data_allTabs; },
        set(arr) {
            that._checkArrayType(arr, path);
            const reducer = function (acc, item, i) {
                that._checkValidStringType(item.id, `${path}[${i}]`);
                acc[item.id] = Object.assign(that._getDefaultTabObj(), item);
                return acc;
            };
            arr.reduce(reducer, that._data_allTabs);
        }
    });
    return this;
};
DefaultOptions.prototype._defineData_openTabsId = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._data_openTabsId; },
        set(value) { that._checkArrayType(value, path); that._data_openTabsId = value; }
    });
    return this;
};
DefaultOptions.prototype._defineData_activeTabId = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._data_activeTabId; },
        set(value) {
            that._checkValidStringType(value, path);
            that._data_activeTabId = value;
        }
    });
    return this;
};
DefaultOptions.prototype.getOption = function () {
    this._defineData(this.option, 'data', 'option.data')
        ._defineData_allTabs(this.option.data, 'allTabs', 'option.data.allTabs')
        ._defineData_openTabsId(this.option.data, 'openTabsId', 'option.data.openTabsId')
        ._defineData_activeTabId(this.option.data, 'activeTabId', 'option.data.activeTabId')
        ._defineClassNames(this.option, 'classNames', 'option.classNames')
        ._defineEvents(this.option, 'events', 'option.events')
        ._defineSwitchTabEventMode(this.option, 'switchTabEventMode', 'option.switchTabEventMode')
        ._defineCloseTabEventMode(this.option, 'closeTabEventMode', 'option.closeTabEventMode');
    return this.option;
};
export default DefaultOptions;
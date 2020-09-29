const DefaultOptions = function (getDeps, setting) {
    const { ArgumentsValidationIns } = getDeps();
    this.option = {};
    this._data = {};
    this._data_allTabs = {};
    this._data_activeTabId = '';
    this._data_openTabsId = [];
    this._events = setting.defaultEvents;
    this._cssClasses = setting.defaultCssClasses;
    this._direction = setting.defaultDirection;
    this._directionRange = ['ltr', 'rtl'];
    this._tabComponent = '';
    this._validation = ArgumentsValidationIns;
    this._setting = setting;
};
DefaultOptions.prototype._defineClassNames = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._cssClasses; },
        set(obj) {
            that._validation.isObj(obj, path);
            const reducer = function (acc, key) {
                let className = obj[key];
                that._validation.isStr(className, path + '.' + key);
                const defaultClass = that._cssClasses[key];
                if (defaultClass) {
                    className = className.trim();
                    if (className === defaultClass)
                        acc[key] = className;
                    else
                        acc[key] = className ? (defaultClass + ' ' + className) : defaultClass;
                }
                return acc;
            };
            Object.keys(obj).reduce(reducer, that._cssClasses);
        }
    });
    return this;
};
DefaultOptions.prototype._defineEvents = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._events; },
        set(value) {
            that._validation.isObj(value, path);
            const reducer = function (acc, item) {
                if (that._events.hasOwnProperty(item)) {
                    let ev = value[item];
                    that._validation.isFn(ev, path + '.' + item);
                    acc[item] = ev;
                }
                return acc;
            };
            Object.keys(value).reduce(reducer, that._events);
        }
    });
    return this;
};
DefaultOptions.prototype._defineDirection = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._direction; },
        set(value) {
            that._validation.isInRange(value, path, that._directionRange);
            that._direction = value;
        }
    });
    return this;
};
DefaultOptions.prototype._defineTabComponent = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._tabComponent; },
        set(value) {
            value && that._validation.isFn(value, path);
            that._tabComponent = value;
        }
    });
    return this;
};
DefaultOptions.prototype._defineData = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._data; },
        set(value) {
            that._validation.isObj(value, path);
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
            that._validation.isArr(arr, path);
            const reducer = function (acc, item, i) {
                that._validation.isStr(item.id, `${path}[${i}]`, false);
                acc[item.id] = Object.assign(that._setting.getDefaultTabObj(), item);
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
        set(value) { that._validation.isArr(value, path); that._data_openTabsId = value; }
    });
    return this;
};
DefaultOptions.prototype._defineData_activeTabId = function (obj, propName, path) {
    const that = this;
    Object.defineProperty(obj, propName, {
        get() { return that._data_activeTabId; },
        set(value) {
            that._validation.isStr(value, path, false);
            that._data_activeTabId = value;
        }
    });
    return this;
};
DefaultOptions.prototype.create = function () {
    this._defineData(this.option, 'data', 'option.data')
        ._defineData_allTabs(this.option.data, 'allTabs', 'option.data.allTabs')
        ._defineData_openTabsId(this.option.data, 'openTabsId', 'option.data.openTabsId')
        ._defineData_activeTabId(this.option.data, 'activeTabId', 'option.data.activeTabId')
        ._defineClassNames(this.option, 'cssClasses', 'option.cssClasses')
        ._defineEvents(this.option, 'events', 'option.events')
        ._defineDirection(this.option, 'direction', 'option.direction')
        ._defineTabComponent(this.option, 'tabComponent', 'option.tabComponent');
    return this.option;
};
export default DefaultOptions;
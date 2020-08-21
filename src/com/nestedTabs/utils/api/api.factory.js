import BaseApi from './baseApi';
import events from '../events';
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, helper, getUserProxy,
        activedTabsHistoryIns, observablePatternIns } = getDeps(param.options);
    BaseApi.call(this, helper);
    helper.objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        _helper: helper,
        _panelProxy: panelProxyIns,
        activedTabsHistory: activedTabsHistoryIns,
        observable: observablePatternIns,
        userProxy: getUserProxy(this)
    });
    const option = this.getOptions(), that = this;
    this._createSubscribers({
        [events._onSetData]: function ({ param, isOnBefore }) {
            const { switchedTabsId, openedTabsId, closedTabsId } = param
                , _on = isOnBefore ? 'before' : 'after';
            closedTabsId.map(item => { that.observable.publisher.trigger(events[`${_on}CloseTab`], item); });
            openedTabsId.map(item => { that.observable.publisher.trigger(events[`${_on}OpenTab`], item); });
            switchedTabsId && that.observable.publisher.trigger(events[`${_on}SwitchTab`], switchedTabsId);
        }
        , [events.beforeSwitchTab]: function (param) {
            option.events.beforeSwitchTab.call(that, param);
            that._panelProxy.addRenderedPanel(param.newSelectedTabId);
        }
        , [events.afterSwitchTab]: function (param) {
            that.activedTabsHistory.addTab(param.oldSelectedTabId);
            option.events.afterSwitchTab.call(that, param);
        }
        , [events.beforeCloseTab]: function (id) { option.events.beforeCloseTab.call(that, id); }
        , [events.afterCloseTab]: function (id) {
            that._panelProxy.removeRenderedPanel(id);
            option.events.afterCloseTab.call(that, id);
        }
        , [events.beforeOpenTab]: function (id) { option.events.beforeOpenTab.call(that, id); }
        , [events.afterOpenTab]: function (id) { option.events.afterOpenTab.call(that, id); }
    });
};
api.prototype = Object.create(BaseApi.prototype);
api.prototype.constructor = api;
api.prototype._createSubscribers = function (subscriberObj) {
    Object.keys(subscriberObj).map(eventName => {
        this.observable.createSubscriber(subscriberObj[eventName]).subscribe(eventName);
    });
};
api.prototype.getOptions = function () { return this.optionManager.getMutableOptions(); };
api.prototype.getCopyData = function () { return this._helper.getCopyState(this.state); };
api.prototype.getInitialState = function () {
    const { data: { activeTabId, openTabsId } } = this.getOptions();
    return { activeTabId, openTabsId };
};
api.prototype.getTabObj = function (tabId) {
    const tabs = this.getOptions().data.allTabs;
    if (tabs.hasOwnProperty(tabId))
        return tabs[tabId];
    return null;
};
api.prototype.getPanel = function (id) {
    return this._panelProxy.getPanel(id
        , this.getOptions().data.allTabs[id].panelComponent);
};
api.prototype.getSelectedTabsHistory = function () { return this.activedTabsHistory.tabsId; };
api.prototype.isActiveTab = function (id) { return this.state.activeTabId == id; };
api.prototype.isOpenTab = function (id) { return this.state.openTabsId.indexOf(id) >= 0; };
api.prototype._beforeSwitchTab = function ({ id, e }) { return this.getOptions().events.beforeSwitchTab({ id, e }); };
api.prototype.eventHandlerFactory = function ({ e, id }) {
    //test mutablitiy of events
    const { events, switchTabEventMode, closeTabEventMode } = this.getOptions()
        , { type } = e;
    events[`on${type}Tab`].call(this, { e, id });
    e.target.className.includes(this.optionManager.setting.defaultCssClasses.closeIcon) ?
        (type === closeTabEventMode && this.closeTab({ e, id }, true))
        : (type === switchTabEventMode && this.switchTab({ e, id }));
};
api.prototype._promiseAllFactory = function ({ reactEvents, callback }) {
    let promisesArr = []; callback = callback || (() => { });
    reactEvents.reduce((acc, eventName) => {
        acc.push(new Promise(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(eventName);
            }).subscribe(eventName);
        }));
        return acc;
    }, promisesArr);
    return Promise.all(promisesArr).then(([tabParam, panelParam]) => {
        callback(tabParam);
        return { ...tabParam };
    }).catch(function (er) { throw er.message; });
};
api.prototype._switchToSiblingTab = function ({ e }, traverseToNext) {
    let index;
    const increaseOrDecrease = traverseToNext ? (value => value + 1) : (value => value - 1)
        , openTabsId = this.state.openTabsId
        , _length = openTabsId.length
        , tabs = this.getOptions().data.allTabs
        , { resolve, checkArrIndex } = this._helper;
    index = increaseOrDecrease(openTabsId.indexOf(this.state.activeTabId));
    if (!checkArrIndex(index, _length))
        return resolve(null);
    while (tabs[openTabsId[index]].disable) {
        index = increaseOrDecrease(index);
        if (!checkArrIndex(index, _length))
            return resolve(null);
    }
    return this.switchTab({ id: this.state.openTabsId[index], e });
};
api.prototype._switchTab = function (id) {
    this.observable.publisher.trigger(events.beforeSwitchTab, { newSelectedTabId: id, oldSelectedTabId: this.state.activeTabId });
    this._activeTab(id);
    return this._promiseAllFactory({
        reactEvents: [events.tabListDidUpdateByActiveTabId, events.panelListDidUpdateByActiveTabId],
        callback: tabParam => { this.observable.publisher.trigger(events.afterSwitchTab, { ...tabParam }); }
    });
};
api.prototype.switchTab = (function () {
    const _validate = function (selectedTabId) { return !this.isActiveTab(selectedTabId) && this.isOpenTab(selectedTabId); }
    return function ({ id, e }) {
        if (!_validate.call(this, id) || !this._beforeSwitchTab({ id, e }))
            return this._helper.resolve(null);
        return this._switchTab(id);
    };
})();
api.prototype.deselectTab = function (e) {
    const id = this.state.activeTabId, { resolve } = this._helper;
    if (!id || !this._beforeSwitchTab({ id, e }))
        return resolve(null);
    return this._switchTab('');
};
api.prototype._switchToUnknowTab = function ({ e }) {
    return this.switchToPreSelectedTab({ e })
        .then(result => result ? this._helper.resolve(result) : this.switchToPreSiblingTab({ e }))
        .then(result => result ? this._helper.resolve(result) : this.switchToNxtSiblingTab({ e }))
        .then(result => result ? this._helper.resolve(result) : this.deselectTab({ e }));
};
api.prototype.switchToNxtSiblingTab = function ({ e }) { return this._switchToSiblingTab({ e }, true); };
api.prototype.switchToPreSiblingTab = function ({ e }) { return this._switchToSiblingTab({ e }, false); };
api.prototype.switchToPreSelectedTab = function ({ e }) {
    let id;
    const tabs = this.getOptions().data.allTabs
        , openTabsId = this.state.openTabsId
    while (!id) {
        const tempId = this.activedTabsHistory.getTab();
        if (tempId == undefined)//if activedTabsHistory array length is 0
            return this._helper.resolve(null);
        ((openTabsId.indexOf(tempId) >= 0) && (!tabs[tempId + ''].disable)) &&
            (id = tempId);
    }
    return this.switchTab({ id, e });
};
api.prototype.setData = (function () {
    const _validate = function (param) {
        if (!param)
            return false;
        const { openTabsId, activeTabId } = param;
        if (typeof activeTabId === 'undefined' && (typeof openTabsId === 'undefined'))
            return false;
        if (openTabsId && (openTabsId.constructor !== Array))
            throw 'passed openTabsId property in setData function must be an Array';
        if (activeTabId && (typeof activeTabId !== 'string'))
            throw 'type of the passed activeTabId property in setData function must be a string';
        return true;
    }
        , getParam = function ({ activeTabId: newSelectedTabId, openTabsId: newOpenTabsId }) {
            const { activeTabId: oldSelectedTabId, openTabsId: oldOpenTabsId } = this.getCopyData();
            const openedTabsId = [], closedTabsId = [...oldOpenTabsId]
                , isSwitched = (newSelectedTabId || newSelectedTabId == 0) && (newSelectedTabId !== oldSelectedTabId);
            let switchedTabsId = '';
            isSwitched && (switchedTabsId = { oldSelectedTabId, newSelectedTabId });
            newOpenTabsId.reduce((acc, item) => {
                const _indexOf = oldOpenTabsId.indexOf(item);
                _indexOf === -1 ? acc.push(item) :
                    closedTabsId.splice(_indexOf, 1);
                return acc;
            }, openedTabsId);
            return { openedTabsId, closedTabsId, switchedTabsId };
        };
    return function (param) {
        if (!_validate(param))
            return this._helper.resolve(null);
        const _param = getParam.call(this, param);
        this.observable.publisher.trigger(events._onSetData, { param: _param, isOnBefore: true });
        this._setData(param);
        return this._promiseAllFactory({
            reactEvents: [events.tabListDidUpdate, events.panelListDidUpdate],
            callback: () => {
                this.observable.publisher.trigger(events._onSetData, { param: _param, isOnBefore: false });
            }
        });
    };
})();
api.prototype.openTab = function (id) {
    if (this.state.openTabsId.indexOf(id) >= 0)
        return this._helper.resolve(null);
    this.observable.publisher.trigger(events.beforeOpenTab, id);
    this._openTab(id);
    return this._promiseAllFactory({
        reactEvents: [events.tabDidMount, events.panelDidMount],
        callback: tabParam => { this.observable.publisher.trigger(events.afterOpenTab, { ...tabParam }); }
    });
};
api.prototype.addTab = function (tabObj) {
    const data = this.getOptions().data;
    data.allTabs.hasOwnProperty(tabObj.id) ||
        (data.allTabs[tabObj.id] = tabObj);
    return this;
};
api.prototype.closeTab = (function () {
    function _closeTab(id) {
        //const { events: { afterCloseTab } } = this.getOptions();
        this.observable.publisher.trigger(events.beforeCloseTab, id);
        this._closeTab(id);
        return this._promiseAllFactory({
            reactEvents: [events.tabWillUnmount, events.panelWillUnmount],
            callback: tabParam => { this.observable.publisher.trigger(events.afterCloseTab, tabParam); }
        });
    }
    return function ({ id, e, switchBeforeClose = true }) {
        const { resolve } = this._helper;
        if (!this.isOpenTab(id))
            return resolve(null);
        if (!this.getOptions().events.beforeCloseTab({ id, e }))
            return resolve(null);
        //this._panelProxy.removeRenderedPanel(id);
        if (switchBeforeClose && this.isActiveTab(id))
            return this._switchToUnknowTab({ e: e }).then(result => _closeTab.call(this, id)).catch(function (err) {
                throw err.message;
            });
        else
            return _closeTab.call(this, id);
    };
})();
api.prototype.forceUpdate = function () {
    const { events: { allTabsDidUpdate } } = this.getOptions();
    this._forceUpdate();
    return this._promiseAllFactory({ reactEvents: [events.tabListDidUpdate, events.panelListDidUpdate], callback: null });
};
api.prototype.clearPanelsCache = function (panelId) {
    panelId ? this._panelProxy.removeRenderedPanel(panelId) :
        this._panelProxy.setRenderedPanels([this.state.activeTabId]);
    return this;
};
export default api;
import baseApi from './baseApi';
import { actions } from '../stateManagement';
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, renderedComponentIns, objDefineNoneEnumerableProps } = getDeps(param.options);
    baseApi.call(this);
    this.closeTab = function (id) {
        if (this.state.openTabsId.indexOf(id) === -1)
            return null;
        const { events: { afterCloseTab } } = this.getMutableCurrentOptions()
            , tabPromise = new Promise(resolve => {
                this.stackedEvent.afterCloseTab.push(resolve);
            })
            , panelPromise = new Promise(resolve => {
                this.stackedEvent.afterClosePanel.push(resolve);
            });
        this.dispatch({ type: actions.close, tabId: id });
        return Promise.all([tabPromise, panelPromise])
            .then(([tab, panel]) => {
                afterCloseTab({ ...tab });
                return { ...tab };
            }).catch(function (err) {
                throw err.message;
            });
    };
    this.openTab = function (id) {
        if (this.state.openTabsId.indexOf(id) >= 0)
            return null;
        const { events: { afterOpenTab } } = this.getMutableCurrentOptions()
            , tabPromise = new Promise(resolve => {
                this.stackedEvent.afterOpenTab.push(resolve);
            })
            , panelPromise = new Promise(resolve => {
                this.stackedEvent.afterOpenPanel.push(resolve);
            });
        this.dispatch({ type: actions.open, tabId: id });
        return Promise.all([tabPromise, panelPromise])
            .then(([tab, panel]) => {
                afterOpenTab({ ...tab });
                return { ...tab };
            }).catch(function (err) {
                throw err.message;
            });
    };
    this.addTab = function (tabObj) {
        const data = this.getMutableCurrentOptions().data;
        data.allTabs.hasOwnProperty(tabObj.id) ||
            (data.allTabs[tabObj.id] = tabObj);
        return this;
    };
    this.getMutableCurrentOptions = () => this.optionManager.getMutableCurrentOptions();
    this.activeTab = function (id) {
        const { events: { afterSwitchTab } } = this.getMutableCurrentOptions();
        if (this.state.activeTabId == id)
            return new Promise(resolve => resolve({ newActiveId: id, oldActiveId: id }));
        const tabPromise = new Promise((resolve, resject) => {
            this.stackedEvent.afterSwitchTab.push(resolve);
        });
        const panelPromise = new Promise((resolve, resject) => {
            this.stackedEvent.afterSwitchPanel.push(resolve);
        });
        this.dispatch({
            type: actions.active,
            tabId: id,
            addRenderedCom: () =>
                this.renderedComponent.addById(id, this.getMutableCurrentOptions().data.allTabs[id].panelComponent),
        });
        return Promise.all([tabPromise, panelPromise])
            .then(([tab, panel]) => {
                afterSwitchTab({ ...tab });
                return { ...tab };
            }).catch(function (err) {
                throw err.message;
            });;
    };
    this.reset = function () { this.optionManager.reset(); return this; };
    this.getOptions = function () { return this.getCurrentOptionsCopy(); };
    this.getData = function () { return { ...this.state }; };
    objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        renderedComponent: renderedComponentIns,
        stackedEvent: (function () {
            const createObj = () => ({
                _value: [],
                push: function (value) { return this._value.push(value); },
                flush: function (param) { while (this._value.length) this._value.pop()(param); }
            });
            return {
                afterSwitchTab: createObj(),
                afterSwitchPanel: createObj(),
                afterCloseTab: createObj(),
                afterClosePanel: createObj(),
                afterOpenTab: createObj(),
                afterOpenPanel: createObj(),
            };
        })()
    });
};
api.prototype = Object.create(baseApi.prototype);
api.prototype.constructor = api;
api.prototype.tabWillUnmount = function ({ id, isActive }) {
    this.stackedEvent.afterCloseTab.flush({ id, isActive });
};
api.prototype.panelWillUnmount = function ({ id, isActive }) {
    this.stackedEvent.afterClosePanel.flush({ id, isActive });
};
api.prototype.tabDidMount = function ({ id, isActive }) {
    this.stackedEvent.afterOpenTab.flush({ id, isActive });
};
api.prototype.panelDidMount = function ({ id, isActive }) {
    this.stackedEvent.afterOpenPanel.flush({ id, isActive });
};
api.prototype.tabDidUpdate = function ({ id, isActive, isFirstCall }) { };
api.prototype.panelDidUpdate = function ({ id, isActive, isFirstCall }) { };
api.prototype.tabListDidUpdateByActiveTabId = function ({ oldActiveId, newActiveId, isFirstCall }) {
    isFirstCall || this.stackedEvent.afterSwitchTab.flush({ oldActiveId, newActiveId });
};
api.prototype.panelListDidUpdateByActiveTabId = function ({ oldActiveId, newActiveId, isFirstCall }) {
    isFirstCall || this.stackedEvent.afterSwitchPanel.flush({ oldActiveId, newActiveId });
};
api.prototype.switchTabEventHandler = function ({ e, id, activeId, isActive }) {
    if (e.target.className.includes(this.optionManager.defaultClasses.closeIcon))
        return;
    const { activeTabEventMode, events } = this.getMutableCurrentOptions(), { type } = e;
    //test mutablitiy of events
    events[`on${type}Tab`](e, id);
    ((type === activeTabEventMode) && events.beforeActiveTab({
        eventObject: e,
        clickedTabId: id,
        currentActiveTabId: activeId,
        isActiveClickedTab: isActive
    }))
        && this.activeTab(id);
};
api.prototype.closeTabEventHandler = function ({ e, id, activeId, isActive }) {
    const { closeTabEventMode, events } = this.getMutableCurrentOptions(), { type } = e;
    //test mutablitiy of events
    events[`on${type}Tab`](e, id);
    ((type === closeTabEventMode) && events.beforeCloseTab({
        eventObject: e,
        clickedTabId: id,
        currentActiveTabId: activeId,
        isActiveClickedTab: isActive
    }))
        && this.closeTab(id);
};
export default api;
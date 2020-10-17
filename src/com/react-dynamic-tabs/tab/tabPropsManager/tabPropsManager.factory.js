const TabPropsManagerFactory = function (deps) {
    const { tabProps, defaultTabInnerProps, userTabInnerProps } = deps;
    this._tabProps = tabProps;
    this._defaultTabInnerProps = defaultTabInnerProps;
    this._userTabInnerProps = userTabInnerProps;
};
TabPropsManagerFactory.prototype = {
    getTabInnerProps: function (param) {
        const { api } = param;
        return api.getOptions().isCustomTabComponent ? this._userTabInnerProps.get(param) :
            this._defaultTabInnerProps.get(param);
    },
    getTabProps: function (param) { return this._tabProps.get(param); }
};
export default TabPropsManagerFactory;
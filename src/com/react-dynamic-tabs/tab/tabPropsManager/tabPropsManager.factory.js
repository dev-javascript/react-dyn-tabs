const TabPropsManagerFactory = function (deps) {
    const { tabProps, defaultTabInnerProps, userTabInnerProps, tabCloseIconProps } = deps;
    this._tabProps = tabProps;
    this._defaultTabInnerProps = defaultTabInnerProps;
    this._userTabInnerProps = userTabInnerProps;
    this._tabCloseIconProps = tabCloseIconProps;
};
TabPropsManagerFactory.prototype = {
    getTabInnerProps: function (param) {
        const { api } = param;
        return api.getOptions().isCustomTabComponent ? this._userTabInnerProps.get(param) :
            this._defaultTabInnerProps.get(param);
    },
    getTabProps: function (param) { return this._tabProps.get(param); },
    getTabCloseIconProps: function (param) { return this._tabCloseIconProps.get(param); }
};
export default TabPropsManagerFactory;
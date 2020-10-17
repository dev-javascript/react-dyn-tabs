const TabPropsManagerFactory = function (deps) {
    const { getLiProps, getDefaultTabProps, getUserTabProps } = deps;
    this._getLiProps = getLiProps;
    this._getDefaultTabProps = getDefaultTabProps;
    this._getUserTabProps = getUserTabProps;
};
TabPropsManagerFactory.prototype = {
    getLiInnerProps: function (param) {
        const { api } = param;
        return api.getOptions().isCustomTabComponent ? this._getUserTabProps(param) :
            this._getDefaultTabProps.get(param);
    },
    getLiProps: function (param) { return this._getLiProps.get(param); }
};
export default TabPropsManagerFactory;
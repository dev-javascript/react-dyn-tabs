const helper = {};
helper.idTemplate = {
    tab: id => `tab_${id}`,
    panel: id => `panel_${id}`,
    ariaLabelledby: id => `tabPanel_${id}`,
    closeIcon: id => `closeIcon_${id}`
};
helper.checkArrIndex = (index, arrLength) => index >= 0 && (index < arrLength);
helper.getInstance = function (Fn) { new (Function.prototype.bind.apply(Fn, arguments)); };
helper.objDefineNoneEnumerableProps = (function () {
    const { defineProperties, entries } = Object;
    return (obj, props = {}) =>
        defineProperties(obj, entries(props).reduce((acc, [key, value]) => {
            acc[key] = { writable: true, value };
            return acc;
        }, {}))
})();
helper.resolve = result => Promise.resolve(result);
helper.getCopyState = function (state) {
    const newState = { ...state };
    newState.openTabsId = [...newState.openTabsId];
    return newState;
};
export default helper;
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
    if (newState.hasOwnProperty('openTabsId'))
        newState.openTabsId = [...newState.openTabsId];
    return newState;
};
helper.getArraysDiff = function (arr1, arr2) {
    const arr1Copy = [...arr1], arr2Copy = [...arr2];
    arr1.map(item => {
        if (arr2.indexOf(item) >= 0) {
            arr1Copy.splice(arr1Copy.indexOf(item), 1);
            arr2Copy.splice(arr2Copy.indexOf(item), 1);
        }
    });
    return [arr1Copy, arr2Copy];
};
helper.arrFilterUntilFirstValue = (arr, callback, isRightToLeft) => {
    isRightToLeft && arr.reverse();
    for (let i = 0, l = arr.length; i < l; i++)
        if (callback(arr[i], i, arr))
            return arr[i];
    return null;
};
helper.throwMissingParam = FnName => { throw `Missing parameter in "${FnName}" function`; };
export default helper;
export const idTemplate = {
    tab: id => `tab_${id}`,
    panel: id => `panel_${id}`,
    closeIcon: id => `closeIcon_${id}`
};
export const getInstance = function (Fn) { new (Function.prototype.bind.apply(Fn, arguments)); };
export const objDefineNoneEnumerableProps = (function () {
    const { defineProperties, entries } = Object;
    return (obj, props = {}) =>
        defineProperties(obj, entries(props).reduce((acc, [key, value]) => {
            acc[key] = { writable: true, value };
            return acc;
        }, {}))
})();
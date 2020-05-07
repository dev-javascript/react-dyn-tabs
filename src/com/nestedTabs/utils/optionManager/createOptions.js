const setAllTabs = function (ops) {
    const newAllTabs = {}, { data } = ops, { allTabs } = data;
    allTabs.map(item => { newAllTabs[item.id] = item; });
    data.allTabs = newAllTabs;
};
export default function (defaultOptions, options) {
    setAllTabs(options);
    return Object.assign(defaultOptions, options);
};
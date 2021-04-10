const helper = {};
helper.checkArrIndex = (index, arrLength) => index >= 0 && (index < arrLength);
helper.getInstance = function (Fn) { new (Function.prototype.bind.apply(Fn, arguments)); };
helper.resolve = result => Promise.resolve(result);
helper.getCopyState = function (state) {
    const newState = { ...state };
    if (newState.hasOwnProperty('openTabIDs'))
        newState.openTabIDs = [...newState.openTabIDs];
    return newState;
};
helper.assingAll = function (targetObj, ...sourcObjs) {
    // copy all enumerable and not enumerable properties into the target
    sourcObjs.map(sourcObj => {
        const enum_only = Object.keys(sourcObj);
        Object.getOwnPropertyNames(sourcObj).map(prop => {
            if (enum_only.indexOf(prop) >= 0)
                targetObj[prop] = sourcObj[prop];
            else
                Object.defineProperty(targetObj, prop, {
                    value: sourcObj[prop],
                    writable: true
                });
        });
    });
    return targetObj;
};
helper.setNoneEnumProps = function (obj, props) {
    const noneEnum = {};
    Object.keys(props).map(prop => {
        noneEnum[prop] = {
            writable: true,
            value: props[prop]
        };
    });
    return Object.defineProperties(obj, noneEnum);
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
helper.throwInvalidParam = FnName => { throw `Invalid parameter error in "${FnName}" function`; };
helper.isObj = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
export default helper;
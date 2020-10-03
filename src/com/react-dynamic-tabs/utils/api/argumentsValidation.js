const ArgumentsValidation = function (fnName) {
    this.errMess = '';
    this._baseMessage = `invalid arguments for the "${fnName || 'anonymous'}" function ! `;
};
ArgumentsValidation.prototype._throwEr = function () {
    const message = this.errMess;
    this.errMess = '';
    throw message;
};
ArgumentsValidation.prototype._setMessage = function (messageBody, propName) {
    propName = propName ? `${propName} property` : 'function parameter';
    this.errMess = this._baseMessage + propName + ' ' + messageBody;
    return this;
};
ArgumentsValidation.prototype.isObj = function (value, propName) {
    Object.prototype.toString.call(value) !== '[object Object]' &&
        this._setMessage('is not an object', propName)._throwEr();
    return this;
};
ArgumentsValidation.prototype.isStr = function (value, propName, allowEmpty) {
    typeof allowEmpty === 'undefined' && (allowEmpty = true);
    (!((typeof value === 'string') && (allowEmpty || (value != ''))))
        && this._setMessage('is not a string', propName)._throwEr();
    return this;
};
ArgumentsValidation.prototype.isArr = function (value, propName) {
    value.constructor !== Array && this._setMessage('is not an Array', propName)._throwEr();
    return this;
};
ArgumentsValidation.prototype.isFn = function (value, propName) {
    typeof value !== 'function' && this._setMessage('is not a function', propName)._throwEr();
    return this;
};
ArgumentsValidation.prototype.isInRange = function (value, propName, rangeArray) {
    rangeArray.indexOf(value) === -1 &&
        this._setMessage(`is out of the range of "${rangeArray.join(',')}"`, propName)._throwEr();
    return this;
};
export default ArgumentsValidation;
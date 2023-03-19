export default function Els(deps, op) {
  this._geElInstance = deps.geElInstance;
  const {isVertical} = op;
  this.els = new Map();
  this._sizeFactory(isVertical);
}
Els.prototype = {
  _sizeFactory: function (isVertical) {
    if (isVertical === true) {
      this._sizeDimension = 'height';
      this._sizeDirections = ['Top', 'Bottom'];
    } else {
      this._sizeDimension = 'width';
      this._sizeDirections = ['Left', 'Right'];
    }
  },
  getEl: function (el) {
    this.els.has(el) || this.els.set(el, this._geElInstance(el, this._sizeDimension, this._sizeDirections));
    return this.els.get(el);
  },
};

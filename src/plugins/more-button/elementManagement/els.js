export default function Els(deps, op) {
  this._geElInstance = deps.geElInstance;
  this.els = new Map();
  this._sizeFactory(op.isVertical);
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
    this.els.has(el) ||
      this.els.set(
        el,
        this._geElInstance({el, sizeDimension: this._sizeDimension, sizeDirections: this._sizeDirections}),
      );
    return this.els.get(el);
  },
};

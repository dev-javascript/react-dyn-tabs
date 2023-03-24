export default function El(el, sizeDimension, sizeDirections) {
  this._el = el;
  this._sizeDimension = sizeDimension;
  this._sizeDirections = sizeDirections;
}
El.prototype = {
  getStyle: function () {
    return (this._style = this._style || this._el.currentStyle || window.getComputedStyle(this._el));
  },
  getPos: function () {
    return (this._pos = this._pos || this._el.getBoundingClientRect());
  },
  getSize: function () {
    return (this.size =
      this.size ||
      (function (that) {
        const style = that.getStyle();
        return (
          that.getPos()[that._sizeDimension] -
          parseFloat(style[`padding${that._sizeDirections[0]}`]) -
          parseFloat(style[`padding${that._sizeDirections[1]}`]) -
          parseFloat(style[`border${that._sizeDirections[1]}Width`]) -
          parseFloat(style[`border${that._sizeDirections[0]}Width`])
        );
      })(this));
  },
  getFullSize: function () {
    return (this.fullSize =
      this.fullSize ||
      (function (that) {
        const style = that.getStyle();
        return (
          that.getPos()[that._sizeDimension] +
          parseFloat(style[`margin${that._sizeDirections[0]}`]) +
          parseFloat(style[`margin${that._sizeDirections[1]}`])
        );
      })(this));
  },
};

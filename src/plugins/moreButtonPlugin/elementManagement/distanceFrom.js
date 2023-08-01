export const constructor = function DistanceFrom(deps, {baseEl, isVertical, dir}) {
  deps.Base.call(this, {isVertical});
  this.baseEl = baseEl;
  this._distanceFactory(isVertical, dir);
};
export const methods = {
  _distanceFactory: function (isVertical, dir) {
    if (isVertical == true) this.getDistance = this._getVerticalDistance;
    else if (dir === 'ltr') this.getDistance = this._getLtrDistance;
    else this.getDistance = this._getRtlDistance;
  },
  _getVerticalDistance: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    return this._getResult(
      baseElIns.getPos().bottom - this.getEl(el).getPos().bottom - parseFloat(baseElIns.getStyle().paddingBottom),
    );
  },
  _getRtlDistance: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    return this._getResult(
      this.getEl(el).getPos().left - baseElIns.getPos().left - parseFloat(baseElIns.getStyle().paddingLeft),
    );
  },
  _getLtrDistance: function (el) {
    const baseElIns = this.getEl(this.baseEl);
    return this._getResult(
      baseElIns.getPos().right - this.getEl(el).getPos().right - parseFloat(baseElIns.getStyle().paddingRight),
    );
  },
  _getResult: function (value) {
    const obj = Object.create({
      sub: function (value) {
        this.value = this.value - value;
        return this;
      },
    });
    obj.value = value;
    return obj;
  },
};

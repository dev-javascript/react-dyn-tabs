/**
 *
 * @param {Object} btnEl
 * @param {Number} margin
 */
export default function (btnEl, margin) {
  let {top, bottom} = btnEl.getBoundingClientRect();
  bottom = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - bottom;
  return Math.max(top, bottom) - margin;
}

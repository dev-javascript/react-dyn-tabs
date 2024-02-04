export default function getClassName(ins) {
  const {showMorePopperClass, tablistViewClass, verticalClass, rtlClass} = ins.optionsManager.setting;
  return (
    tablistViewClass +
    ' ' +
    verticalClass +
    ' ' +
    (ins.getOption('direction') == 'rtl' ? rtlClass + ' ' : '') +
    showMorePopperClass
  );
}

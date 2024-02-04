import Tab from './tab.factory.js';
import memomizeTabComponent from './memomizeTab.js';
export const tabPropsManager = function tabPropsManager(ins, props) {
  const {id, selectedTabID} = props;
  const isSelected = selectedTabID === id;
  const {disable, title, tooltip} = ins.getTab(id);
  const outputProps = {
    'tab-id': id,
    className: ins.getSetting('tabClass'),
    tabIndex: -1,
    title: tooltip || title,
  };
  //check if tab is selected
  if (isSelected) {
    outputProps.tabIndex = 0;
    outputProps.className += ' ' + ins.getSetting('selectedClass');
  }
  // check if tab is disable
  if (disable) {
    outputProps.tabIndex = -1;
    outputProps.className += ' ' + ins.getSetting('disableClass');
  }
  // check if accessibility option is enable
  if (ins.getOption('accessibility')) {
    outputProps.role = 'tab';
    outputProps.id = ins.getSetting('ariaLabelledbyIdTemplate', id);
    outputProps['aria-controls'] = ins.getSetting('panelIdTemplate', id);
    outputProps['aria-label'] = tooltip || title;
    outputProps['aria-selected'] = outputProps['aria-expanded'] = isSelected;
  }
  return outputProps;
};
export const tabInnerPropsManager = function tabInnerPropsManager(ins, props) {
  const {id, selectedTabID} = props;
  const isSelected = selectedTabID == id;
  const {iconClass} = ins.getTab(id);
  const outputProps = {
    id,
    isSelected,
    api: ins.userProxy,
    tabProps: {
      'tab-id': id,
      className: ins.getSetting('titleClass'),
      tabIndex: -1,
      role: 'presentation',
    },
  };
  // check if there is a iconClass option
  if (iconClass) {
    outputProps.iconProps = {
      className: ins.getSetting('iconClass') + ' ' + iconClass,
      role: 'presentation',
    };
  }
  return outputProps;
};
export const closeIconPropsManager = function closeIconPropsManager(ins) {
  const outputProps = {
    className: ins.getSetting('closeClass'),
  };
  // check if accessibility option is enable
  if (ins.getOption('accessibility')) {
    outputProps.role = 'button';
  }
  return outputProps;
};
export const memomizeTab = memomizeTabComponent;
export default memomizeTabComponent(
  Tab.bind(undefined, (ins) => ({
    tabPropsManager: (props) => tabPropsManager(ins, props),
    tabInnerPropsManager: (props) => tabInnerPropsManager(ins, props),
    closeIconPropsManager: () => closeIconPropsManager(ins),
  })),
);

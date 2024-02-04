import {forwardRef} from 'react';
let _counter = 0;
export default function Api(components) {
  return new (this.helper.module(
    function (api) {
      this._components = components;
      this._api = api;
      this._counter = _counter++;
      this._buttonID = this._getButtonID();
      this._tablistID = this._getTabListID();
      this.TabsComponent = this._getTabsComponent();
    },
    {
      _getTabListID: function () {
        return `rc-dyn-tabs-popupcontainer_${this._counter}`;
      },
      _getButtonID: function () {
        return `rc-dyn-tabs-more-button-${this._counter}`;
      },
      btnPropsGenerator: function (onClick, ref, isOpen) {
        const result = {
          onClick,
          ref,
          className: this._api.getSetting('titleClass') + ' ' + this._api.getSetting('showMoreButtonClass'),
        };
        if (this._api.getOption('accessibility')) {
          result.tabIndex = 0;
          result.role = 'button';
          result['aria-haspopup'] = 'true';
          result['aria-label'] = 'More tabs'; //todo
          result.id = this._buttonID;
          result['aria-controls'] = this._tablistID;
          result['aria-expanded'] = isOpen;
        }
        return result;
      },
      _getTabsComponent: function () {
        const buttonID = this._buttonID;
        const tablistID = this._tablistID;
        const TabsPropsManager = function (ins, props) {
          const {dir, isVertical} = props;
          const result = {
            className: ins.getSetting('tablistClass') + ' ' + ins.getSetting(`${dir}Class`),
          };
          if (isVertical) {
            result.className += ' ' + ins.getSetting('verticalClass');
          }
          if (ins.getOption('accessibility')) {
            result.role = 'menu';
            result['aria-labelledby'] = buttonID;
            result.id = tablistID;
          }
          return result;
        };
        this._components.Tabs = forwardRef(
          this._components.TabsFactory.bind(undefined, (ins) => ({
            Tab: this._getTabComponent(),
            TabsPropsManager: (props) => TabsPropsManager(ins, props),
          })),
        );
        return components.Tabs;
      },
      _getTabComponent: function () {
        return this._components.memomizeTab(
          this._components.TabFactory.bind(undefined, (ins) => ({
            tabPropsManager: (props) => {
              const originalProps = this._components.tabPropsManager(ins, props);
              const {
                'aria-controls': ariaControls,
                'aria-expanded': ariaExpanded,
                'aria-selected': ariaSelected,
                id,
                ...rest
              } = originalProps;
              if (rest.role) {
                rest.role = 'menuitem';
              }
              return rest;
            },
            tabInnerPropsManager: (props) => this._components.tabInnerPropsManager(ins, props),
            closeIconPropsManager: () => this._components.closeIconPropsManager(ins),
          })),
        );
      },
    },
  ))(this);
}

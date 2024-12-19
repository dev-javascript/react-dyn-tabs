import {forwardRef} from 'react';
let _counter = 0;
export default function Api(components, setOpen) {
  return new (this.helper.module(
    function (api) {
      this._components = components;
      this._api = api;
      this._counter = _counter++;
      this._buttonID = this._getButtonID();
      this._tablistID = this._getTabListID();
      this.TabsComponent = this._getTabsComponent();
      (this._closePopper = () => {
        setOpen(false);
      }),
        (this._togglePopper = (open) => {
          setOpen(!open);
        });
      this._onBackdropClick = this._onBackdropClick.bind(this);
      this._onSelectTab = this._onSelectTab.bind(this);
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
          title: this._api.getOption('moreButtonPlugin_buttonTooltip'),
        };
        if (this._api.getOption('accessibility')) {
          result.tabIndex = 0;
          result.role = 'button';
          result['aria-haspopup'] = 'true';
          result['aria-label'] = result.title; //todo
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
                'aria-controls': ariaControls, // eslint-disable-line no-unused-vars
                'aria-expanded': ariaExpanded, // eslint-disable-line no-unused-vars
                'aria-selected': ariaSelected, // eslint-disable-line no-unused-vars
                id, // eslint-disable-line no-unused-vars
                ...rest
              } = originalProps;
              if (rest.role) {
                rest.role = 'menuitem';
              }
              return rest;
            },
            tabInnerPropsManager: (props) => ({...this._components.tabInnerPropsManager(ins, props), popup: true}),
            closeIconPropsManager: () => this._components.closeIconPropsManager(ins),
          })),
        );
      },
      onButtonClick: function (ev, open) {
        ev.stopPropagation();
        this._registerBackdropEvent()._togglePopper(open);
      },
      _onBackdropClick: function () {
        this._closePopper();
      },
      _onSelectTab: function () {
        this._closePopper();
      },
      _registerBackdropEvent: function () {
        window.document.removeEventListener('click', this._onBackdropClick, {once: true});
        window.document.addEventListener('click', this._onBackdropClick, {once: true});
        return this;
      },
      _CleanBackdropEvent: function () {
        window.document.removeEventListener('click', this._onBackdropClick, {once: true});
        return this;
      },
      onDestroy: function () {
        this._CleanBackdropEvent();
        this._cleanSelectEvent();
      },
      _registerSelectEvent: function () {
        this._api.on('onSelect', this._onSelectTab);
      },
      _cleanSelectEvent: function () {
        this?._api && this._api.off && this._api.off('onSelect', this._onSelectTab);
      },
      onMount: function () {
        this._registerSelectEvent();
      },
    },
  ))(this);
}

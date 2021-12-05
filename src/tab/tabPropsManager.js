const TabPropsManager = function ({api, id, isSelected}) {
  this._api = api;
  this._id = id;
  this._isSelected = isSelected;
  this._op = api.optionsManager.options;
  this._setting = api.optionsManager.setting;
  this._tabObj = api.getTab(id);
};
TabPropsManager.prototype.getTabProps = function () {
  const outputProps = {
    'tab-id': this._id,
    className: this._setting.tabClass,
    tabIndex: -1,
    style={visibility:this._tabObj._visibility}
  };

  //check if tab is selected
  if (this._isSelected) {
    outputProps.tabIndex = 0;
    outputProps.className += ` ${this._setting.selectedClass}`;
  }

  // check if tab is disable
  if (this._tabObj.disable) {
    outputProps.tabIndex = -1;
    outputProps.className += ` ${this._setting.disableClass}`;
  }
  // check if _enableTabRefs is enable
  if (this._op._enableTabRefs) {
    outputProps.ref = (ref) => {
      this._api.setTab(this._id, {_ref: ref});
    };
  }

  // check if accessibility option is enable
  if (this._op.accessibility) {
    outputProps.role = 'tab';
    outputProps['aria-controls'] = this._setting.panelIdTemplate(this._id);
    outputProps['aria-labelledby'] = this._setting.ariaLabelledbyIdTemplate(this._id);
    outputProps['aria-selected'] = outputProps['aria-expanded'] = this._isSelected;
  }
  return outputProps;
};
TabPropsManager.prototype.getTabInnerProps = function () {
  const outputProps = {
    id: this._id,
    isSelected: this._isSelected,
    api: this._api.userProxy,
    tabProps: {
      'tab-id': this._id,
      className: this._setting.titleClass,
      title: this._tabObj.tooltip,
      tabIndex: -1,
    },
  };
  // check if there is a iconClass option
  if (this._tabObj.iconClass) {
    outputProps.iconProps = {
      className: this._setting.iconClass + ' ' + this._tabObj.iconClass,
      role: 'presentation',
    };
  }

  // check if accessibility option is enable
  if (this._op.accessibility) {
    outputProps.tabProps.id = this._setting.ariaLabelledbyIdTemplate(this._id);
    outputProps.tabProps.role = 'presentation';
  }
  return outputProps;
};
TabPropsManager.prototype.getCloseIconProps = function () {
  const outputProps = {
    className: this._setting.closeClass,
  };
  // check if accessibility option is enable
  if (this._op.accessibility) {
    outputProps.role = 'presentation';
  }
  return outputProps;
};
export default TabPropsManager;

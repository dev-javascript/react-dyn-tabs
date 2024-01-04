export default {
  tabsPropsGenerator: function (parentProps) {
    const {dir, isVertical} = parentProps;
    const _setting = this.optionsManager.setting;
    const result = {
      className: _setting.tablistClass + ' ' + _setting[dir + 'Class'],
    };
    if (isVertical) {
      result.className += ' ' + _setting.verticalClass;
    }
    if (this.optionsManager.options.accessibility) {
      result.role = 'tablist';
    }
    return result;
  },
  tabPropsGenerator: function (parentProps) {
    const {id, isSelected} = parentProps;
    const _setting = this.optionsManager.setting;
    const outputProps = {
      'tab-id': id,
      className: _setting.tabClass,
      tabIndex: -1,
    };
    //check if tab is selected
    if (isSelected) {
      outputProps.tabIndex = 0;
      outputProps.className += ` ${_setting.selectedClass}`;
    }
    // check if tab is disable
    if (this.getTab(id).disable) {
      outputProps.tabIndex = -1;
      outputProps.className += ` ${_setting.disableClass}`;
    }
    // check if accessibility option is enable
    if (this.optionsManager.options.accessibility) {
      outputProps.role = 'tab';
      outputProps['aria-controls'] = _setting.panelIdTemplate(id);
      outputProps['aria-labelledby'] = _setting.ariaLabelledbyIdTemplate(id);
      outputProps['aria-selected'] = outputProps['aria-expanded'] = isSelected;
    }
    return outputProps;
  },
  tabInnerPropsGenerator: function (parentProps) {
    const {id, isSelected} = parentProps;
    const _setting = this.optionsManager.setting;
    const _tabObj = this.getTab(id);
    const outputProps = {
      id,
      isSelected,
      api: this.userProxy,
      tabProps: {
        'tab-id': id,
        className: _setting.titleClass,
        title: _tabObj.tooltip,
        tabIndex: -1,
      },
    };
    // check if there is a iconClass option
    if (_tabObj.iconClass) {
      outputProps.iconProps = {
        className: _setting.iconClass + ' ' + _tabObj.iconClass,
        role: 'presentation',
      };
    }
    // check if accessibility option is enable
    if (this.optionsManager.options.accessibility) {
      outputProps.tabProps.id = _setting.ariaLabelledbyIdTemplate(id);
      outputProps.tabProps.role = 'presentation';
    }
    return outputProps;
  },
  closeIconPropsGenerator: function () {
    const outputProps = {
      className: this.optionsManager.setting.closeClass,
    };
    // check if accessibility option is enable
    if (this.optionsManager.options.accessibility) {
      outputProps.role = 'presentation';
    }
    return outputProps;
  },
  tablistViewPropsGenerator: function () {
    const {
      options: {isVertical, direction},
      setting,
      setting: {tablistViewClass, verticalClass, responsiveClass},
    } = this.optionsManager;

    let className = tablistViewClass + ' ' + setting[direction + 'Class'];
    if (isVertical) {
      className += ' ' + verticalClass;
    }
    if (responsiveClass) {
      className += ' ' + responsiveClass;
    }
    return {className};
  },
  tablistContainerPropsGenerator: function () {
    const className = this.optionsManager.setting.tablistContainerClass;
    return {className};
  },
  tablistPropsGenerator: function (ref, state) {
    const {openTabIDs, selectedTabID} = state;
    const {direction: dir, isVertical} = this.optionsManager.options;
    return {
      openTabIDs,
      selectedTabID,
      ref,
      dir,
      isVertical,
    };
  },
};

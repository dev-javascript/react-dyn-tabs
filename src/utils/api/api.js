import React from 'react';
import {apiProps, apiConstructor} from './api.factory';
import OptionManager from './optionManager/optionManager.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import Pub_Sub from './pub_sub.js';
import BaseApi from './baseApi.js';
import {ForceUpdateContext, StateContext} from '../context.js';
import {Tabs as TabsComponent} from '../../tabList/tabList.js';
import Tabs from './tabs.js';
const getDeps = function (options = {}) {
  const activedTabsHistory = new ActivedTabsHistory(),
    optionsManager = new OptionManager({options});
  BaseApi.call(this, {
    helper,
    initialState: optionsManager.initialState,
  });
  Tabs.call(this, {initialTabs: optionsManager.initialTabs});
  Pub_Sub.call(this);
  return {
    activedTabsHistory,
    helper,
    optionsManager,
    tablistRef: React.createRef(),
    contexts: {ForceUpdateContext, StateContext},
    TabsComponent,
  };
};
apiConstructor.prototype = Object.create(BaseApi.prototype);
helper.assingAll(apiConstructor.prototype, Tabs.prototype, Pub_Sub.prototype, apiProps).constructor = apiConstructor;
export default apiConstructor.bind(null, getDeps);

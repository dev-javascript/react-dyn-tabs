import { apiProps, apiConstructor } from './api.factory';
import OptionManager from './optionManager/optionManager.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import Pub_Sub from './pub_sub.js';
import Tabs from './tabs.js';
import BaseApi from './baseApi.js';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)({ options }), activedTabsHistoryIns = new (ActivedTabsHistory)()
    BaseApi.call(this, helper);
    Tabs.call(this);
    Pub_Sub.call(this);
    return { activedTabsHistoryIns, optionManagerIns, helper };
};
helper.assingAll(apiConstructor.prototype, BaseApi.prototype, Tabs.prototype, Pub_Sub.prototype, apiProps).constructor = apiConstructor;
export default apiConstructor.bind(null, getDeps);


import Helper from '../helper.js';
export default Helper.module(
  function () {
    this.tabsId = [];
  },
  {
    reset: function () {
      this.tabsId = [];
    },
    add: function (id) {
      if (id) this.tabsId.push(id);
    },
    remove: function (id) {
      const tabIDs = this.tabsId;
      while (tabIDs.indexOf(id) >= 0) {
        tabIDs.splice(tabIDs.indexOf(id), 1);
      }
      return this;
    },
  },
);

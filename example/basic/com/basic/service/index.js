import React from 'react';
import MockPanel1 from '../com/eager/eagerPanel1.js';
import MockPanel2 from '../com/eager/eagerPanel2.js';
export default {
  getLocalData: function () {
    return {
      tabs: [
        {
          id: '1',
          title: 'mock tab 1',
          closable: true,
          disable: false,
          panelComponent: MockPanel1, // or <MockPanel1></MockPanel1>
        },
        {
          id: '2',
          title: 'mock tab 2',
          tooltip: 'mock tab 2',
          iconClass: 'css class for icon',
          closable: true,
          panelComponent: <MockPanel2></MockPanel2>,
        },
      ],
      selectedTabID: '1',
      onLoad: function () {
        const context = this;
      },
      onInit: function () {
        const context = this;
      },
      onChange: function ({currentData, previousData}) {
        const context = this;
      },
      beforeSelect: function (e, id) {
        const context = this;
        return true;
      },
      onSelect: ({currentSelectedTabId, previousSelectedTabId}) => {
        const context = this;
      },
      beforeClose: function (e, id) {
        const context = this;
        return true;
      },
      onClose: function (closedTabsId) {
        const context = this;
      },
      onOpen: function (openeTabsId) {
        const context = this;
      },
      onDestroy: function () {
        const context = this;
      },
    };
  },
};

import React from 'react';
import MockPanel1 from '../com/eager/eagerPanel1.js';
import MockPanel2 from '../com/eager/eagerPanel2.js';
export default {
    getLocalData: function () {
        return {
            tabs: [{
                id: '1',
                title: 'mock tab 1',
                closable: true,
                panelComponent: <MockPanel1></MockPanel1>
            }, {
                id: '2',
                title: 'mock tab 2',
                iconClass: 'ui-icon ui-icon-seek-end',
                closable: true,
                panelComponent: <MockPanel2></MockPanel2>
            }],
            selectedTabID: '1',
            onSelect: (switchTabsId, api) => {
            }
        };
    }
};
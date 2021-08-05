import React, {useState, useRef} from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';
import useLog from '../useLog.js';
import './tabs.css';
export default function () {
  const ref = useRef({});
  const [ConsoleComponent, log] = useLog();
  // assign and update ref.current.log with new value of log function
  ref.current.log = log;
  const allComponents = {
    Panel1: (props) => <p>tab content 1</p>,
    Panel2: (props) => <p>tab content 2</p>,
    Panel3: (props) => <p>tab content 3</p>,
    Panel4: (props) => <p>tab content 4</p>,
  };
  const options = {
    tabs: [
      {
        id: '1',
        title: 'tab 1',
        panelComponent: allComponents.Panel1,
        iconClass: 'fa fa-home',
      },
      {
        id: '2',
        title: 'tab 2',
        panelComponent: allComponents.Panel2,
        iconClass: 'fa fa-book',
      },
      {id: '3', title: 'tab 3', panelComponent: allComponents.Panel3},
      {id: '4', title: 'tab 4', panelComponent: allComponents.Panel4},
    ],
    selectedTabID: '1',
    onLoad: function () {
      ref.current.log('[onLoad]');
    },
    onInit: function () {
      //don't use setState inside the onInit callback because it leads to an infinite loop.
      console.log('[onInit]');
    },
    onChange: function () {
      ref.current.log('[onChange]');
    },
    onOpen: function () {
      ref.current.log('[onOpen]');
    },
    beforeSelect: function () {
      ref.current.log('[beforeSelect]');
      return true;
    },
    onFirstSelect: function () {
      ref.current.log('[onFirstSelect]');
    },
    onSelect: function () {
      ref.current.log('[onSelect]');
    },
    beforeClose: function () {
      ref.current.log('[beforeClose]');
      return true;
    },
    onClose: function () {
      ref.current.log('[onClose]');
    },
    onDestroy: function () {
      ref.current.log('[onDestroy]');
    },
  };
  const [Tablist, Panellist, ready] = useDynTabs(options);
  const [isVertical, setIsVertical] = useState(false);
  let _instance;
  ready((instance) => {
    _instance = instance;
  });
  const actions = {
    openNewTab: () => {
      _instance
        .open({
          title: 'new tab',
          closable: false,
          panelComponent: (props) => <p>new tab content</p>,
        })
        .then(() => {
          ref.current.log('(new tab is open)');
        });
    },
    toggleDirection: () => {
      _instance.setOption('direction', _instance.getOption('direction') === 'ltr' ? 'rtl' : 'ltr').refresh();
    },
    toggleVertical: () => {
      const _isVertical = _instance.getOption('isVertical');
      _instance.setOption('isVertical', !_isVertical).refresh();
      setIsVertical(!_isVertical);
    },
    selectTab4: () => {
      _instance.isOpen('4') &&
        _instance.select('4').then(() => {
          ref.current.log('(tab 4 is selected)');
        });
    },
    disableSelectedTab: () => {
      _instance.setTab(_instance.getData().selectedTabID, {disable: true}).refresh();
    },
    closeSelectedTab: () => {
      _instance.close(_instance.getData().selectedTabID);
    },
    disableAccessibility: () => {
      _instance.setOption('accessibility', false).refresh();
    },
    customizeCloseIcon: () => {
      _instance.setOption('beforeSelect', function (e) {
        if (e.target.className.includes('custom-close-icon')) {
          return false;
        }
        ref.current.log('[beforeSelect]');
        return true;
      });
      _instance.getData().openTabIDs.map((id) => {
        _instance.setTab(id, {closable: false});
      });
      _instance
        .setOption('tabComponent', (props) => {
          const {id, api: instance} = props;
          return (
            <>
              <button {...props.tabProps}>
                <span
                  onClick={() => {
                    instance.close(id);
                  }}
                  className="custom-close-icon"
                  style={{padding: '0em 0.4em'}}>
                  ×
                </span>
                {props.children}
                {props.iconProps && <span {...props.iconProps}></span>}
              </button>
            </>
          );
        })
        .refresh();
    },
  };
  return (
    <>
      <div id="actions">
        <div>
          <button onClick={actions.openNewTab}>open new tab</button>
          <button onClick={actions.toggleDirection}>toggle direction</button>
          <button onClick={actions.toggleVertical}>vertical | horizontal</button>
          <button onClick={actions.selectTab4}>select tab 4</button>
          <button onClick={actions.disableSelectedTab}>disable selected tab</button>
          <button onClick={actions.closeSelectedTab}>close selected tab</button>
          <button onClick={actions.disableAccessibility}>disable accessibility</button>
          <button onClick={actions.customizeCloseIcon}>customize close icon</button>
        </div>
      </div>
      <div
        style={{
          margin: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '7px',
        }}>
        <div style={{width: '100%', display: isVertical ? 'table' : 'block'}}>
          <Tablist></Tablist>
          <Panellist></Panellist>
        </div>
      </div>
      <ConsoleComponent></ConsoleComponent>
    </>
  );
}

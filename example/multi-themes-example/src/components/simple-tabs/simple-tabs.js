import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import '../../scoped-themes/scss/card.scss';
import '../../scoped-themes/scss/classic.scss';
import '../../scoped-themes/scss/basic.scss';
import '../../scoped-themes/scss/bootstrap.scss';
import useDynTabs from 'react-dyn-tabs';
export default function () {
  const allComponents = {
    Panel1: (props) => <p>tab content 1</p>,
    Panel2: <p>tab content 2</p>,
    Panel3: <p>tab content 3</p>,
    Panel4: (props) => <p>tab content 4</p>,
  };
  const options = {
    tabs: [
      {id: '1', title: 'tab 1', panelComponent: allComponents.Panel1},
      {id: '2', title: 'tab 2', panelComponent: allComponents.Panel2},
      {id: '3', title: 'tab 3', panelComponent: allComponents.Panel3},
      {id: '4', title: 'tab 4', panelComponent: allComponents.Panel4},
    ],
    selectedTabID: '1',
  };
  const [Tablist, Panellist, ready] = useDynTabs(options);
  return (
    <div
      style={{
        margin: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '7px',
      }}>
      <div style={{width: '100%', display: 'block'}}>
        <Tablist></Tablist>
        <Panellist></Panellist>
      </div>
    </div>
  );
}

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab1',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab3',
      panelComponent: <p> panel 3 </p>,
    },
    {
      id: '4',
      title: 'tab4',
      panelComponent: <p> panel 4 </p>,
    },
  ],
  selectedTabID: '3',
  theme: 'card',
};

let counter = 4;

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions, [MoreButtonPlugin]);

  const newTab = function () {
    ready((instance) => {
      counter++;
      instance.open({title: `New Tab ${counter}`, panelComponent: <p>{`New Tab ${counter}`}</p>});
    });
  };

  return (
    <div>
      <TabList>
        <i
          className="fa fa-plus"
          onClick={newTab}
          style={{alignItems: 'center', display: 'inline-flex', padding: '0px 15px'}}></i>
      </TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

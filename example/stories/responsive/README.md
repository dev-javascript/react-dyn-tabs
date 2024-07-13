```tsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab 1',
      panelComponent: (porps) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      panelComponent: (porps) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab 3',
      panelComponent: (porps) => <p> panel 3 </p>,
    },
    {
      id: '4',
      title: 'tab 4',
      panelComponent: (porps) => <p> panel 4 </p>,
    },
    {
      id: '5',
      title: 'tab 5',
      panelComponent: (porps) => <p> panel 5 </p>,
    },
  ],
  selectedTabID: '2',
};

function App() {
  const [TabList, PanelList] = useDynTabs(initialOptions, [MoreButtonPlugin]);
  return (
    <div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
function App2() {
  const [TabList, PanelList] = useDynTabs(initialOptions);
  return (
    <div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}

<>
  <App />
  <App2 />
</>;
```

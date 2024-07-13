```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';

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
  ],
  selectedTabID: '1',
};

function App() {
  const [TabList, PanelList] = useDynTabs(initialOptions);
  return (
    <div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/style/react-dyn-tabs-rtl.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab 1',
      icon: 'fa fa-home',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      icon: 'fa fa-book',
      disable: true,
      panelComponent: (props) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab 3',
      icon: 'fa fa-person',
      panelComponent: (props) => <p> panel 3 </p>,
    },
  ],
  selectedTabID: '1',
  theme: 'card',
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

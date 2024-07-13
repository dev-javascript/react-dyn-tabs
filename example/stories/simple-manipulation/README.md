```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab1',
      panelComponent: (porps) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab2',
      panelComponent: (porps) => <p> panel 2 </p>,
    },
  ],
  selectedTabID: '1',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);
  const addTab3 = function () {
    ready((instance) => {
      // open tab 3
      instance.open({id: '3', title: 'Tab 3', panelComponent: (porps) => <p> panel 3 </p>}).then(() => {
        console.log('tab 3 is open');
      });
      // switch to tab 3
      instance.select('3').then(() => {
        console.log('tab 3 is selected');
      });
    });
  };

  return (
    <div>
      <button onClick={addTab3}>Add tab 3</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

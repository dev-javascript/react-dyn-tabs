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

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const closeSelectedTab = function () {
    ready((instance) => {
      const {selectedTabID} = instance.getData();
      instance.close(selectedTabID);
    });
  };

  return (
    <div>
      <button onClick={closeSelectedTab}>close selected tab</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### Close selected tab and switch to the first Tab

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

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const handler = function () {
    ready((instance) => {
      const {selectedTabID} = instance.getData();
      instance.close(selectedTabID, false);
      instance.select('1');
    });
  };

  return (
    <div>
      <button onClick={handler}>close selected tab and select first tab</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

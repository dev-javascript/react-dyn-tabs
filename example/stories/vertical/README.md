### card theme

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
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab 3',
      panelComponent: <p> panel 3 </p>,
    },
  ],
  selectedTabID: '1',
  isVertical: true,
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

### bootstrap theme

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-bootstrap.css';
import useDynTabs from 'react-dyn-tabs';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab 1',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab 3',
      panelComponent: <p> panel 3 </p>,
    },
  ],
  selectedTabID: '1',
  isVertical: true,
  theme: 'bootstrap',
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

### classic theme

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-classic.css';
import useDynTabs from 'react-dyn-tabs';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab 1',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab 3',
      panelComponent: <p> panel 3 </p>,
    },
  ],
  selectedTabID: '1',
  isVertical: true,
  theme: 'classic',
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

### basic theme

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-basic.css';
import useDynTabs from 'react-dyn-tabs';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab 1',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
    {
      id: '3',
      title: 'tab 3',
      panelComponent: <p> panel 3 </p>,
    },
  ],
  selectedTabID: '1',
  isVertical: true,
  theme: 'basic',
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

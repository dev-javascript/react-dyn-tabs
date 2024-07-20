### card theme

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

const initialOptions = {
  tabs: Array.from({length: 20}).map((value, i) => ({
    id: `${i + 1}`,
    title: `tab ${i + 1}`,
    panelComponent: <p> {`panel ${i + 1}`} </p>,
  })),
  selectedTabID: '2',
  theme: 'card',
  isVertical: true,
};

function App() {
  const [TabList, PanelList] = useDynTabs(initialOptions, [MoreButtonPlugin]);
  return (
    <div style={{height: '300px', overflowY: 'hidden', resize: 'vertical'}}>
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
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

const initialOptions = {
  tabs: Array.from({length: 20}).map((value, i) => ({
    id: `${i + 1}`,
    title: `tab ${i + 1}`,
    panelComponent: <p> {`panel ${i + 1}`} </p>,
  })),
  selectedTabID: '2',
  theme: 'bootstrap',
  isVertical: true,
};

function App() {
  const [TabList, PanelList] = useDynTabs(initialOptions, [MoreButtonPlugin]);
  return (
    <div style={{height: '300px', overflowY: 'hidden', resize: 'vertical'}}>
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
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

const initialOptions = {
  tabs: Array.from({length: 20}).map((value, i) => ({
    id: `${i + 1}`,
    title: `tab ${i + 1}`,
    panelComponent: <p> {`panel ${i + 1}`} </p>,
  })),
  selectedTabID: '2',
  theme: 'classic',
  isVertical: true,
};

function App() {
  const [TabList, PanelList] = useDynTabs(initialOptions, [MoreButtonPlugin]);
  return (
    <div style={{height: '300px', overflowY: 'hidden', resize: 'vertical'}}>
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
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

const initialOptions = {
  tabs: Array.from({length: 20}).map((value, i) => ({
    id: `${i + 1}`,
    title: `tab ${i + 1}`,
    panelComponent: <p> {`panel ${i + 1}`} </p>,
  })),
  selectedTabID: '2',
  theme: 'basic',
  isVertical: true,
};

function App() {
  const [TabList, PanelList] = useDynTabs(initialOptions, [MoreButtonPlugin]);
  return (
    <div style={{height: '300px', overflowY: 'hidden', resize: 'vertical'}}>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

```tsx
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
<App />;
```

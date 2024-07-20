### Change Tab title

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
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const handler = function (e) {
    ready((instance) => {
      instance.setTab('1', {title: 'tab 1 is changed'});
      instance.refresh();
    });
  };

  return (
    <div>
      <button onClick={handler}>change tab 1 title</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### re-create panel component

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
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const handler = function (e) {
    ready((instance) => {
      instance.setTab('1', {panelComponent: (props) => <p> panel 1 is re-created </p>});
      instance.refresh();
    });
  };

  return (
    <div>
      <button onClick={handler}>re-create panel 1 component</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### Update panel component

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
      my_custom_data: 'my custom data',
      panelComponent: (props) => <p> {props.api.getTab(props.id).my_custom_data} </p>,
    },
    {
      id: '2',
      title: 'tab 2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const handler = function (e) {
    ready((instance) => {
      instance.setTab('1', {my_custom_data: 'my custom data is changed !'});
      instance.refresh();
    });
  };

  return (
    <div>
      <button onClick={handler}>Update Panel 1 Component</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

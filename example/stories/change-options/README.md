### change Theme

```jsx
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-bootstrap.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-classic.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-basic.css';
import useDynTabs from 'react-dyn-tabs';

const initialOptions = {
  tabs: [
    {
      id: '1',
      title: 'tab1',
      iconClass: 'fa fa-home',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab2',
      iconClass: 'fa fa-book',
      panelComponent: (props) => <p> panel 2 </p>,
    },
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const changeTheme = function (e) {
    ready((instance) => {
      instance.setOption('theme', e.target.value);
      instance.refresh();
    });
  };

  return (
    <div>
      <select onChange={changeTheme} style={{marginBottom: '15px'}}>
        <option value="card">card theme</option>
        <option value="bootstrap">bootstrap theme</option>
        <option value="classic">classic theme</option>
        <option value="basic">basic theme</option>
      </select>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### change direction

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
      title: 'tab1',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab2',
      panelComponent: (props) => <p> panel 2 </p>,
    },
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);
  const rightToLeft = function () {
    ready((instance) => {
      instance.setOption('direction', 'rtl');
      instance.refresh();
    });
  };

  return (
    <div>
      <button onClick={rightToLeft}>right to left</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### change isVertical

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
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);
  const setVertical = function () {
    ready((instance) => {
      instance.setOption('isVertical', true);
      instance.refresh();
    });
  };

  return (
    <div>
      <div>
        <button onClick={setVertical}>vertical</button>
      </div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### change Tab component

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
      iconClass: 'fa fa-home',
      panelComponent: (props) => <p> panel 1 </p>,
    },
    {
      id: '2',
      title: 'tab2',
      iconClass: 'fa fa-book',
      panelComponent: (props) => <p> panel 2 </p>,
    },
  ],
  selectedTabID: '1',
  theme: 'card',
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions);

  const customizeTabComponent = function () {
    ready((instance) => {
      instance.setOption('tabComponent', (props) => (
        <button {...props.tabProps} style={{display: 'flex', flexDirection: 'column'}}>
          {props.iconProps && <span {...props.iconProps}></span>}
          <span>{props.children}</span>
        </button>
      ));
      instance.refresh();
    });
  };

  return (
    <div>
      <button onClick={customizeTabComponent}>Customize Tab Component</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

### change moreButtonPlugin_iconComponent

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
};

function App() {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions, [MoreButtonPlugin]);

  function handler() {
    ready((instance) => {
      instance
        .setOption('moreButtonPlugin_iconComponent', ({instance}) => {
          return <span style={{padding: '0.5rem 1rem', textTransform: 'none'}}>More</span>;
        })
        .refresh();
    });
  }

  return (
    <div>
      <button onClick={handler}>customize icon component of more button</button>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
}
<App />;
```

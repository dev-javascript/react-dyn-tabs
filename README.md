[![Test coverage](https://codecov.io/gh/dev-javascript/react-dyn-tabs/graph/badge.svg?token=GT1LU074L2)](https://codecov.io/gh/dev-javascript/react-dyn-tabs) [![NPM version](http://img.shields.io/npm/v/react-dyn-tabs.svg?style=flat-square)](https://www.npmjs.com/package/react-dyn-tabs) [![node](https://img.shields.io/badge/node.js-%3E=_8.0-green.svg?style=flat-square)](http://nodejs.org/download/) [![React](https://img.shields.io/badge/React-%3E=_16.8.0-green.svg?style=flat-square)](https://react.dev/) [![License](http://img.shields.io/npm/l/react-dyn-tabs.svg?style=flat-square)](LICENSE) [![npm download](https://img.shields.io/npm/dm/react-dyn-tabs.svg?style=flat-square)](https://npmjs.org/package/react-dyn-tabs) [![Build Status](https://travis-ci.org/ly-components/react-dyn-tabs.png)](https://travis-ci.org/ly-components/react-dyn-tabs)

# react-dyn-tabs

React Dynamic Tabs with full API

### [Demo](https://dev-javascript.github.io/react-dyn-tabs/)

## Features

- **Responsive (using `more button`)**
- **Full API (Open & Close & Select & Refresh & setOption & setTab, ...)**
- **lazy loading and rendering**
- **Customizable style**
- **Return to last used tab when closing selected tab**
- **PanelList can be rendered outside the TabList container**
- **ARIA accessible**
- **Customizable Tab component**
- **Multiple themes**
- **The core is about 23kb**

## Table of Contents

<!-- toc -->

- [Installation](#installation)
- [Syntax](#syntax)
- [Minimal Usage Example](#minimal-usage-example)
- [Simple Manipulation Example](#simple-manipulation-example)
- [Options](#options)
  - [tabs](#tabs)
  - [selectedTabID](#selectedtabid)
  - [direction](#direction)
  - [tabComponent](#tabcomponent)
  - [defaultPanelComponent](#defaultpanelcomponent)
  - [accessibility](#accessibility)
  - [isVertical](#isvertical)
  - [onLoad](#onload)
  - [onInit](#oninit)
  - [onChange](#onchange)
  - [beforeSelect](#beforeselect)
  - [onFirstSelect](#onfirstselect)
  - [onSelect](#onselect)
  - [onOpen](#onopen)
  - [beforeClose](#beforeclose)
  - [onClose](#onclose)
  - [onDestroy](#ondestroy)
- [Instance methods](#instance-methods)
  - [isOpen](#isopen)
  - [open](#open)
  - [isSelected](#isselected)
  - [select](#select)
  - [close](#close)
  - [refresh](#refresh)
  - [getOption](#getoption)
  - [setOption](#setoption)
  - [getTab](#gettab)
  - [setTab](#settab)
  - [on](#on)
  - [one](#one)
  - [off](#off)
  - [getData](#getdata)
  - [getPreviousData](#getpreviousdata)
  - [sort](#sort)
- [tabData](#tabdata)
- [Lazy Loading](#lazy-loading)
- [Plugins](#plugins)
  - [More Button Plugin](#more-button-plugin)
- [Render custom components at the end of the Tablist](#render-custom-components-at-the-end-of-the-tablist)
- [Styling](#styling)
- [Caveats](#caveats)
- [Test](#test)
- [License](#license)

<!-- tocstop -->

## Installation

> $ npm install react-dyn-tabs --save

or

> $ yarn add react-dyn-tabs

If you need to directly include script in your html, use the following link :

```js
<script src="https://unpkg.com/react-dyn-tabs@latest/dist/react-dyn-tabs.umd.min.js"></script>
```

## Syntax

```js
[TabList, PanelList, ready] = useDynTabs(initialOptions, plugins);
```

## Minimal Usage Example

```js
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

export default () => {
  const [TabList, PanelList] = useDynTabs(initialOptions);
  return (
    <div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
};
```

## Simple Manipulation Example

```js
import React from 'react';
import 'react-dyn-tabs/style/scss/react-dyn-tabs.scss';
import 'react-dyn-tabs/themes/scss/react-dyn-tabs-card.scss';
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

export default () => {
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
};
```

**NOTE :**

- Use `ready` function to access the `instance` object

  ```js
  ready((instance) => {
    // manipulate tabs using instance object here
  });
  ```

- `ready` function accepts a `callback` as its parameter and executes it as soon as Tabs get mounted.

- If `ready` function is called after the Tabs has been mounted, the `callback` passed in will be executed immediately.

- `ready` function can be executed multiple times and its identity is stable and won’t change on re-renders.

## Options

### tabs

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>
        <p><span>Array of</span> <a href="#tabData">tabData</a></p>
      </td>
      <td><code>[]</code></td>
      <td>false</td>
      <td>initial opened tabs</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  tabs: [
    {
      id: '1',
      title: 'home',
      iconClass: 'fa fa-home',
      closable: true,
      panelComponent: (porps) => <p> home content </p>,
    },
    {
      id: '2',
      title: 'contact',
      tooltip: 'contact',
      disable: true,
      closable: false,
      panelComponent: (porps) => <p> contact content </p>,
    },
  ],
});
```

### selectedTabID

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
      <td>specifies initial selected tab</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  tabs: [
    {
      id: '1',
      title: 'home',
      iconClass: 'fa fa-home',
      closable: true,
      panelComponent: (porps) => <p> home content </p>,
    },
    {
      id: '2',
      title: 'contact',
      tooltip: 'contact',
      disable: true,
      closable: false,
      panelComponent: (porps) => <p> contact content </p>,
    },
  ],
  selectedTabID: '2',
});
```

### direction

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>string</td>
      <td>'ltr'</td>
      <td>false</td>
      <td>can be either of 'ltr' or 'rtl'</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({direction: 'rtl'});
```

### tabComponent

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>React component</td>
      <td>false</td>
      <td>custom tab component</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  tabComponent: (props) => {
    const {id, isSelected, api: instance} = props;
    return (
      <button {...props.tabProps}>
        {props.children}
        {props.iconProps && <span {...props.iconProps}></span>}
      </button>
    );
  },
});
```

### defaultPanelComponent

Default value for `panelComponent` option.

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>React component | React element</td>
      <td>false</td>
      <td></td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  defaultPanelComponent: (props) => {
    const {id, isSelected, api: instance} = props;
    return <div>loading...</div>;
  },
});
```

### accessibility

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>boolean</td>
      <td>true</td>
      <td>false</td>
      <td></td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({accessibility: false});
```

**NOTE :**

When `accessibility` option is `true`, it sets the id attribute of `panel` and `button` elements.

### isVertical

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>boolean</td>
      <td>false</td>
      <td>false</td>
      <td></td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({isVertical: true});
```

### onLoad

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>This event is fired only once, when Tabs are mounted</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onLoad: function () {
    console.log('[onLoad]');
  },
});
```

**NOTE :**

You can use `this` keyword inside all callback options. It refers to the `instance` object.

### onInit

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>This event is triggered after every render.</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onInit: function () {
    console.log('[onInit]');
  },
});
```

**NOTE :**

Do not use `setState` inside the `onInit` callback because it leads to an infinite loop.

### onChange

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>fires when we open|close|select a tab. this event is not fired initially</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onChange: function ({currentData, previousData, closedTabIDs, openedTabIDs}) {
    console.log('[onChange]');
  },
});
```

### beforeSelect

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>
        Fires when the user clicks on the tab, but before select them. 
        This event should return boolean true or false, If the event returns false the tab is not selected.
      </td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  beforeSelect: function (e, id) {
    console.log('[beforeSelect]');
    return true;
  },
});
```

### onFirstSelect

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>fires after selecting a tab for the first time. It is not fired for the initial selected tab</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onFirstSelect: function ({currentSelectedTabId, previousSelectedTabId}) {
    console.log('[onFirstSelect]');
  },
});
```

### onSelect

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>fires after selecting a tab. this event is not fired for the initial selected tab</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onSelect: function ({currentSelectedTabId, previousSelectedTabId}) {
    console.log('[onSelect]');
  },
});
```

### onOpen

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>fires after opening tabs. this event is not fired for initial opened tabs</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onOpen: function (openedTabIDs) {
    console.log('[onOpen]');
  },
});
```

### beforeClose

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>
        fires when the user clicks on the close icon, but before close them. 
        This event should return boolean true or false,  If the event return false the tab is not closed.
      </td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  beforeClose: function (e, id) {
    console.log('[beforeClose]');
    return true;
  },
});
```

### onClose

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>fires after closing tabs</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onClose: function (closedTabIDs) {
    console.log('[onClose]');
  },
});
```

### onDestroy

<table>
  <tbody>
    <tr>
      <th>type</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>function</td>
      <td>false</td>
      <td>fires before destroying useDynTabs hook</td>
    </tr>
  </tbody>
</table>

**Example**

```js
const [TabList, PanelList, ready] = useDynTabs({
  onDestroy: function () {
    console.log('[onDestroy]');
  },
});
```

## Instance methods

### isOpen

Return value : `boolean`

Parameters:

- `id: String`

**Example**

```js
const result = instance.isOpen('Your tab ID');
```

### open

Triggers `onInit`, `onChange` and `onOpen` events.

It only triggers `onInit` event, if the tab is already open.

Return value : `Promise`

Parameters:

- `tabData: Object`

**Example**

```js
if (instance.isOpen('contact') == false) {
  instance
    .open({
      id: 'contact',
      title: 'contact',
      tooltip: 'contact',
      disable: false,
      closable: true,
      iconClass: '',
      panelComponent: <ContactPanel></ContactPanel>,
    })
    .then(({currentData, instance}) => {
      console.log('contact tab is open');
    });
}
```

### isSelected

Return value : `boolean`

Parameters:

- `id: String`

**Example**

```js
const result = instance.isSelected('Your tab ID');
```

### select

Makes current and previous selected tab to be re-rendered

Triggers `onInit`, `onChange` and `onSelect` events.

It only triggers `onInit` event, if the tab is already selected.

Return value : `Promise`

Parameters:

- `id: string`

**Example**

```js
if (instance.isSelected('1') == false) {
  instance.select('1').then(({currentData, instance}) => {
    console.log('tab 1 is selected');
  });
}
```

### close

Triggers `onInit`, `onChange` and `onClose` events.

It only triggers `onInit` event, if the tab is already closed.

When `switching` parameter is `true`, it switches to previous selected tab

Return value : `Promise`

Parameters:

- `id: string`
- `switching: boolean (default : true)`

**Example**

```js
if (instance.isOpen('2') == true) {
  instance.close('2').then(({currentData, instance}) => {
    console.log('tab 2 is closed');
  });
}
```

### refresh

Makes all tabs to be re-rendered.

triggers `onInit` event.

Return value : `Promise`

**Example**

```js
instance.refresh().then(({currentData, instance}) => {});
```

### getOption

Parameters:

- `optionName : String`

**Example**

```js
const direction = instance.getOption('direction');
const onSelect = instance.getOption('onSelect');
```

### setOption

Can be used for setting all options except `selectedTabID` and `tabs` options.

This function does not re-render Tabs. If you need to re-render Tabs, use `refresh` method after this function.

Return value : `instance object`

Parameters:

- `optionName : String`
- `optionValue : string|boolean|object|function`

**Example**

```js
instance.setOption('direction', 'rtl');
instance.setOption('onSelect', () => {});
instance.setOption('beforeSelect', () => false);
```

### getTab

Get `tabData` object

Return value : `tabData object`

Parameters:

- `id : String`

**Example**

```js
const {id, title, tooltip, disable, lazy, iconClass, closable, panelComponent} = instance.getTab('contactID');
console.log(id); //contactID
```

### setTab

Set `tabData` object.

This function does not re-render Tabs. If you need to re-render Tabs, use `refresh` method after this function.

Return value : `instance object`

Parameters:

- `tab id : String`
- `source object : containing the properties you want to apply`

**Example**

```js
instance.setTab('home', {disable: true});
instance.setTab('contact', {closable: false, panelComponent: (props) => <p>contact panel</p>});
```

### on

Attach an event handler function for one event.

Return value : `instance object`

Parameters:

- `event Name : String (can be either of onFirstSelect|onSelect|onClose|onOpen|onInit|onChange|onDestroy)`
- `handler : function`

**Example**

```js
const handler = React.useCallback(function (params) {
  const {currentSelectedTabId, previousSelectedTabId} = params;
}, []);
instance.on('onSelect', handler);
```

### one

Attach a handler to an event. The handler is executed at most once.

Return value : `instance object`

Parameters:

- `event Name : String (can be either of onFirstSelect|onSelect|onClose|onOpen|onInit|onChange|onDestroy)`
- `handler : function`

**Example**

```js
instance.one('onSelect', function ({currentSelectedTabId, previousSelectedTabId}) {});
```

### off

Remove an event handler.

Return value : `instance object`

Parameters:

- `event Name : String (can be either of onFirstSelect|onSelect|onClose|onOpen|onInit|onChange|onDestroy)`
- `handler : function (A handler function previously attached for the event)`

**Example**

```js
const handler = React.useCallback(function () {}, []);
const attachHandler = () => {
  instance.on('onSelect', handler);
};
const deattachHandler = () => {
  instance.off('onSelect', handler);
};
```

### getData

Get a copy of data

Return value : `Data` Object

**Example**

```js
const {selectedTabID, openTabIDs} = instance.getData();
```

**NOTE :**

- `getCopyData` function is an older version of `getData` function and it is enabled by default so that existing users do not have to change their code. You are free to use both conventions.

### getPreviousData

Get a copy of data in previous render

Return value : `Data` Object

**Example**

```js
const {selectedTabID, openTabIDs} = instance.getPreviousData();
```

**NOTE :**

- `getCopyPerviousData` function is an older version of `getPreviousData` function and it is enabled by default so that existing users do not have to change their code. You are free to use both conventions.

### sort

Useful for sorting Tabs manually.

Triggers `onInit` event.

Return value : `Promise`

Parameters:

- `Array of all Tabs IDs`

**Example**

```js
const {openTabIDs} = instance.getData();
instance.sort(openTabIDs.reverse()).then(({currentData, instance}) => {
  console.log('sorting Tabs has finished');
});
```

## tabData

<table>
  <tbody>
    <tr>
      <th>property name</th>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
      <th>description</th>
    </tr>
    <tr>
      <td>id</td>
      <td>string</td>
      <td></td>
      <td>false</td>
      <td>an unique identifier for each tab</td>
    </tr>
    <tr>
      <td>title</td>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
      <td></td>
    </tr>
    <tr>
      <td>tooltip</td>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
      <td></td>
    </tr>
    <tr>
      <td>panelComponent</td>
      <td>React Element | React Component | null</td>
      <td>A function component which returns empty div</td>
      <td>false</td>
      <td></td>
    </tr>
    <tr>
      <td>lazy</td>
      <td>boolean</td>
      <td>false</td>
      <td>false</td>
      <td>
       If set to false the panel will be rendered initially.
       if set to true the panel will not be rendered until the tab is activated
      </td>
    </tr>
    <tr>
      <td>closable</td>
      <td>boolean</td>
      <td>true</td>
      <td>false</td>
      <td></td>
    </tr>
    <tr>
      <td>iconClass</td>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
      <td>class name for the icon</td>
    </tr>
    <tr>
      <td>disable</td>
      <td>boolean</td>
      <td>false</td>
      <td>false</td>
      <td></td>
    </tr>
  </tbody>
</table>

**Example**

```js
const tabData = {
  id: 'contactID',
  title: 'contactTitle',
  tooltip: 'contactTooltip',
  disable: true,
  lazy: true,
  iconClass: 'fa fa-home',
  closable: false,
  panelComponent: (porps) => <p> contact content </p>,
};
const [TabList, PanelList, ready] = useDynTabs({tabs: [tabData]});
// or
if (instance.isOpen(tabData.id) == false) {
  instance.open(tabData).then(() => {});
}
```

## Lazy Loading

Defer loading of tab content until the tab is activated

Example 1

```js
const Panel3 = React.lazy(() => import('./components/panel3.js'));
function LazyLoadingPanel3(porps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Panel3 {...porps}></Panel3>
    </Suspense>
  );
}
useDynTabs({
  tabs: [
    {id: '1', title: 'eager loading tab 1', panelComponent: <p>panel 1</p>},
    {id: '2', title: 'eager loading tab 2', lazy: true, panelComponent: <p>panel 2</p>},
    {id: '3', title: 'lazy loading tab 3', lazy: true, panelComponent: LazyLoadingPanel3},
  ],
  selectedTabID: '1',
});
```

**NOTE :**

- panel 1 is eagerly loaded and rendered.
- panel 2 is eagerly loaded but will not be rendered until tab 2 is activated.
- panel 3 will not be loaded and rendered until tab 3 is activated.

Example 2 ( using onFirstSelect event )

```js
useDynTabs({
  tabs: [
    {id: '1', title: 'eager loading tab 1', panelComponent: <p>panel 1</p>},
    {id: '2', title: 'eager loading tab 2', lazy: true, panelComponent: <p>panel 2</p>},
    {id: '3', title: 'lazy loading tab 3', lazy: true},
  ],
  selectedTabID: '1',
  defaultPanelComponent: function DefaultPanel() {
    return <div>loading...</div>;
  },
  onFirstSelect: function ({currentSelectedTabId}) {
    const instance = this;
    if (currentSelectedTabId === '3') {
      import('path to/panel3.js').then((defaultExportedModule) => {
        const Panel3 = defaultExportedModule.default;
        instance.setTab('3', {panelComponent: Panel3});
        instance.refresh();
      });
    }
  },
});
```

## Plugins

### More Button Plugin

Make Tabs `responsive`

**Usage**

```js
import React from 'react';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.css';
import useDynTabs from 'react-dyn-tabs';
import MoreButtonPlugin from 'react-dyn-tabs/plugins/moreButtonPlugin';

export default () => {
  const [TabList, PanelList, ready] = useDynTabs(initialOptions, [MoreButtonPlugin]);
  return (
    <div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
};
```

**Options**

<table>
  <tbody>
    <tr>
      <th>option name</th>
      <th>type</th>
      <th>description</th>
    </tr>
    <tr>
      <td>moreButtonPlugin_buttonComponent</td>
      <td>React Function Component</td>
      <td>customize root component of more button</td>
    </tr>
    <tr>
      <td>moreButtonPlugin_iconComponent</td>
      <td>React Function Component</td>
      <td>customize icon component of more button</td>
    </tr>
    <tr>
      <td>moreButtonPlugin_buttonTooltip</td>
      <td>string</td>
      <td></td>
    </tr>
  </tbody>
</table>

**Example**

```js
useDynamicTabs(
  {
    tabs: [
      {id: '1', title: 'tab1', panelComponent: <span>tab content 1</span>},
      {id: '2', title: 'tab2', panelComponent: <span>tab content 2</span>},
      {id: '3', title: 'tab3', panelComponent: <span>tab content 3</span>},
    ],
    selectedTabID: '1',
    moreButtonPlugin_iconComponent: ({instance}) => {
      return <i className={`fa fa-chevron-${instance.getOption('direction') === 'rtl' ? 'left' : 'right'}`} />;
    },
    moreButtonPlugin_buttonTooltip: 'show more tabs',
  },
  [MoreButtonPlugin],
);
```

## Render custom components at the end of the Tablist

- render `new tab` button example :

  ```js
    const [TabList, PanelList, ready] = useDynTabs(initialOptions, [MoreButtonPlugin]);
    return (
      <div>
        <TabList>
          <button onClick={()=>{ ready(instance => instance.open({title:'new tab'})) }}>
            NEW
          </button>
        </TabList>
        <PanelList></PanelList>
      </div>
    );
  };

  ```

- render `close all` button example :

  ```js
    const [TabList, PanelList, ready] = useDynTabs(initialOptions, [MoreButtonPlugin]);
    return (
      <div>
        <TabList>
          <button onClick={()=>{ ready(instance=>{ instance.getData().openTabIDs.forEach(id=>instance.close(id,false)); })}}>
            CLOSE ALL
          </button>
        </TabList>
        <PanelList></PanelList>
      </div>
    );
  };

  ```

## Styling

`react-dyn-tabs` does not include any style loading by default. Default stylesheets and themes are provided and can be included in your application if desired.

```js
import 'react-dyn-tabs/style/react-dyn-tabs.min.css';
// or import 'react-dyn-tabs/style/scss/react-dyn-tabs.scss';
import 'react-dyn-tabs/themes/react-dyn-tabs-card.min.css';
// or import 'react-dyn-tabs/themes/scss/react-dyn-tabs-card.scss';
```

**NOTE :**

You can find other themes at themes folder and multiple themes example at example/multi-themes-example folder.

Include `react-dyn-tabs/style/react-dyn-tabs-rtl.min.css` for `rtl` mode

## Caveats

- Some actions like open, select, close and refresh cause re-rendering, and using them immediately after calling useDynTabs hook will create an infinite loop and other bugs that most likely you don't want to cause. you should use them inside event listeners or subscriptions.

- Do not use setState inside the onInit callback because it leads to an infinite loop.

## Test

```js
$ npm run test
```

## License

MIT

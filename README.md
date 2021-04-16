# react-dyn-tabs
React Dynamic Tabs with full API

### [document](https://github.com/dev-javascript/react-dyn-tabs/)



## Features

* **Based on React hook**
* **Open & Close & Select & Refresh**
* **lazy/eager loading**
* **Customizable style**
* **Full API**
* **Return to last used tab when closing selected tab**
* **PanelList can be rendered outside the TabList container**
* **ARIA accessible**


## Table of Contents

<!-- toc -->

- [Installation](#installation)
- [Basic Example](#basic-example)
- [Options](#options)
  * [tabs](#tabs)
  * [selectedTabID](#selectedTabID)
  * [direction](#direction)
  * [tabComponent](#tabComponent)
  * [defaultPanelComponent](#defaultPanelComponent)
  * [accessibility](#accessibility)
  * [onLoad](#onLoad)
  * [onInit](#onInit)
  * [onChange](#onChange)
  * [beforeSelect](#beforeSelect)
  * [onSelect](#onSelect)
  * [onOpen](#onOpen)
  * [beforeClose](#beforeClose)
  * [onClose](#onClose)
  * [onDestroy](#onDestroy)
- [Methodes](#methodes)
  * [isOpen](#isOpen)
  * [open](#open)
  * [isSelected](#isSelected)
  * [select](#select)
  * [close](#close)
  * [refresh](#refresh)
  * [getOption](#getOption)
  * [setOption](#setOption)
  * [getTab](#getTab)
  * [setTab](#setTab)
  * [on](#on)
  * [one](#one)
  * [off](#off)    
- [tabData](#tabData)
- [Lazy Loading](#lazyLoading)
- [Styling](#styling)
- [License](#license)


<!-- tocstop -->


## Installation

```js
$ npm install react-dyn-tabs --save
```


## Basic Example

```js
import React from 'react';
import useDynTabs from 'react-dyn-tabs';
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/default.css';
import ContactComponent from './contact-component';

export default () => {
  const options = {
     tabs : [
     {
      id : '1',
      title : 'home',
      closable: false,
      panelComponent : porps => <p> home content </p>
     },
     {
      id : '2',
      title : 'contact',
      panelComponent : ContactComponent
     }
     ],
     selectedTabID : '1'
  };
  const [TabList , PanelList , api] = useDynTabs(options);
  return (
    <div>
      <TabList></TabList>
      <PanelList></PanelList>
    </div>
  );
};
```


## Styling
react-dyn-tabs does not include any style loading by default. Default stylesheets and themes are provided and can be included in your application if desired.

```js
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/default.css';
```


## License

MIT

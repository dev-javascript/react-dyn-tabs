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
* **Supporting custom Tab component**


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
  * [getCopyData](#getCopyData)
- [tabData](#tabData)
- [Lazy Loading](#lazy-loading)
- [Styling](#styling)
- [Caveats](#caveats)
- [Test](#test)
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
        tabs: [
            {
                id: '1',
                title: 'home',
                closable: false,
                panelComponent: porps => <p> home content </p>
            },
            {
                id: '2',
                title: 'contact',
                panelComponent: ContactComponent // or can be <ContactComponent />
            }
        ],
        selectedTabID: '1',
        onLoad: function(){
           // do sth here
        }
    };
    const [TabList, PanelList, instance] = useDynTabs(options);
    return (
        <div>
            <TabList></TabList>
            <PanelList></PanelList>
        </div>
    );
};
```


**NOTE :**

instance Object will not be changed after re-rendering multiple times.
Its value always refers to same reference.



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
 const [ TabList , PanelList , instance ] = useDynTabs({
   tabs : [
     {
         id: '1',
         title: 'home',
         iconClass : 'fa fa-home',
         closable: true,
         panelComponent: porps => <p> home content </p>
     },
     {
        id: '2',
        title: 'contact',
        tooltip: 'contact',
        disable: true,
        closable: false,
        panelComponent: porps => <p> contact content </p>
     }
   ]
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
      <td>initial selected tab id</td>
    </tr>
  </tbody>
</table>

**Example**

```js
 const [ TabList , PanelList , instance ] = useDynTabs({
   tabs : [
     {
         id: '1',
         title: 'home',
         iconClass : 'fa fa-home',
         closable: true,
         panelComponent: porps => <p> home content </p>
     },
     {
        id: '2',
        title: 'contact',
        tooltip: 'contact',
        disable: true,
        closable: false,
        panelComponent: porps => <p> contact content </p>
     }
   ],
   selectedTabID : '2'
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
 const [ TabList , PanelList , instance ] = useDynTabs({ direction : 'rtl' });
```
or
```js
if( instance.getOption('direction') !== 'ltr') {
  instance.setOption('direction','ltr');
  instance.refresh();
}
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
 const [ TabList , PanelList , instance ] = useDynTabs({ 
     tabComponent : props => {
       const { id , isSelected , instance } = props;
       return (
                <button  {...props.tabProps}>
                    {props.children}
                    {
                        props.iconProps &&
                        <span {...props.iconProps}></span>
                    }
                </button>
        );
     }
   });
```
or
```js
const CustomTabComponent = props => {
    const { id, isSelected, instance } = props;
    return (
        <button  {...props.tabProps}>
            {props.children}
            {
                props.iconProps &&
                <span {...props.iconProps}></span>
            }
        </button>
    );
};
instance.setOption('tabComponent', CustomTabComponent);
instance.refresh();
```


### defaultPanelComponent

Default value for panelComponent option.

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
 const [ TabList , PanelList , instance ] = useDynTabs({ 
     defaultPanelComponent : props => {
       const { id , isSelected , instance } = props;
       return <div></div>
     }
   });
```
or
```js
instance.setOption('defaultPanelComponent', props => <p></p>);
instance.refresh();
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
 const [ TabList , PanelList , instance ] = useDynTabs({ accessibility : false });
```
or
```js
if( instance.getOption('accessibility') == true ){
  instance.setOption('accessibility',false).refresh();
}
```


**NOTE :**

This option assigns id attribute on panel element and button element inside the tab. 
 for having elements without id attribute, set this option to false.



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
      <td>This event is fired only once, after first render</td>
    </tr>
  </tbody>
</table>

**Example**

```js
 const [ TabList , PanelList , instance ] = useDynTabs({ onLoad : function() {
      // you can use 'this' here which refers to the instance
 } });
 // or
 instance.setOption('onLoad', () => { } ).refresh();
```


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
 const [ TabList , PanelList , instance ] = useDynTabs({ onInit : function() {
      // you can use 'this' here which refers to the instance
 } });
 // or
 instance.setOption('onInit', () => { } ).refresh();
```


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
 const [ TabList , PanelList , instance ] = useDynTabs({ onChange : function({ currentData , perviousData }) {
      // you can use 'this' here which refers to the instance
 } });
 // or
 instance.setOption('onChange', ({ currentData , perviousData }) => { } ).refresh();
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
        fires when the user click on the tab, but before select them. 
        This event should return boolean true or false,  If the event return false the tab is not selected.
      </td>
    </tr>
  </tbody>
</table>

**Example**

```js
 const [ TabList , PanelList , instance ] = useDynTabs({ beforeSelect : function(e, id) {
      // you can use 'this' here which refers to the instance
      return true;
 } });
 // or
 instance.setOption('beforeSelect', (e, id) => { return true; } ).refresh();
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
      <td>fires after selecting tabs</td>
    </tr>
  </tbody>
</table>

**Example**

```js
 const [ TabList , PanelList , instance ] = useDynTabs({ 
   onSelect : function({currentSelectedTabId , perviousSelectedTabId}) {
      // you can use 'this' here which refers to the instance
   } 
 });
 // or
 instance.setOption('onSelect', ({currentSelectedTabId , perviousSelectedTabId}) => { } ).refresh();
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
      <td>fires after opening tabs</td>
    </tr>
  </tbody>
</table>

**Example**

```js
 const [ TabList , PanelList , instance ] = useDynTabs({ onOpen : function(openedTabIDs) {
      // you can use 'this' here which refers to the instance
   }});
 // or
 instance.setOption('onOpen', (openedTabIDs) => { } ).refresh();
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
        fires when the user click on the close icon, but before close them. 
        This event should return boolean true or false,  If the event return false the tab is not closed.
      </td>
    </tr>
  </tbody>
</table>

**Example**

```js
 const [ TabList , PanelList , instance ] = useDynTabs({ beforeClose : function(e, id) {
      // you can use 'this' here which refers to the instance
      return true;
 } });
 // or
 instance.setOption('beforeClose', (e, id) => { return true;} ).refresh();
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
 const [ TabList , PanelList , instance ] = useDynTabs({ onClose : function(closedTabIDs) {
      // you can use 'this' here which refers to the instance
   }});
 // or
 instance.setOption('onClose', closedTabIDs => { } ).refresh();
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
 const [ TabList , PanelList , instance ] = useDynTabs({ onDestroy : function() {
      // you can use 'this' here which refers to the instance
   }});
 // or
 instance.setOption('onDestroy', () => { } ).refresh();
```

## Methodes

### isOpen

Return value : boolean

Parameters:

- `id: String`

**Example**

```js
const result = instance.isOpen('tab ID');
```


### open

Triggers 'onInit', 'onChange' and 'onOpen' event. 
opening an already opened tab just triggers 'onInit' event.

Return value : Promise

Parameters:

- `tabData: Object`

**Example**

```js
if( instance.isOpen('2') == false ){
   instance.open({
    id: '2',
    title: 'contact',
    tooltip: 'contact',
    disable: false,
    closable: true,
    iconClass: '',
    panelComponent: <ContactPanel></ContactPanel>
   }).then(({currentDta,instance})=>{
       //do sth here
   });
}
```


### isSelected

Return value : boolean

Parameters:

- `id: String`

**Example**

```js
const result = instance.isSelected('tab ID');
```


### select

Triggers 'onInit', 'onChange' and 'onSelect' event. 
Selecting an already selected tab just triggers 'onInit' event.

Return value : Promise

Parameters:

- `id: string`

**Example**

```js
if( instance.isSelected('your tab id') == false ){
   instance.select('your tab id').then(({currentDta,instance})=>{
       //do sth here
   });
}
```


### close

Triggers 'onInit', 'onChange' and 'onClose' event. 
Closing an already closed tab just triggers 'onInit' event.

Return value : Promise

Parameters:

- `id: string`

**Example**

```js
if( instance.isOpen('2') == true ){
   instance.close('2').then(({currentDta,instance})=>{
     //do sth here
   });
}
```


### refresh

triggers onInit event.

Return value : Promise


**Example**

```js
instance.refresh().then(({currentDta,instance})=>{
    //do sth here
});
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

for re-rendering immediately after this function, you should call refresh method after it.

Return value : instance

Parameters:

- `optionName : String`
- `optionValue : string|boolean|object|function`

**Example**

```js
instance.setOption('direction','rtl');
instance.setOption('onSelect',()=>{});
```


### getTab

get tabData by id

Return value : tabData object

Parameters:

- `id : String`

**Example**

```js
const tabData = instance.getTab('3');
console.log(tabData.id); // 3
``` 


### setTab

set tabData by id.
 for re-rendering immediately after this function, you should call refresh method after it.

Return value : instance

Parameters:

- `optionName : String`
- `optionValue : string|boolean|object|function`

**Example**

```js
instance.setTab('disable',true);
instance.setTab('panelComponent' , props => <p/>);
```


### on

Attach an event handler function for one event.

Return value : instance

Parameters:

- `event Name : String (can be either of of onSelect|onClose|onOpen|onInit|onChange|onDestroy)`
- `handler : function`

**Example**

```js
instance.on('onSelect',function(params){
    const {currentSelectedTabId , perviousSelectedTabId} = params;
   // can use 'this' here which refers to the instance
});
```


### one

Attach a handler to an event. The handler is executed at most once.

Return value : instance

Parameters:

- `event Name : String (can be either of of onSelect|onClose|onOpen|onInit|onChange|onDestroy)`
- `handler : function`

**Example**

```js
instance.one('onSelect',function({currentSelectedTabId , perviousSelectedTabId}){
   // can use 'this' here which refers to the instance
});
```


### off

Remove an event handler.

Return value : instance

Parameters:

- `event Name : String (can be either of of onSelect|onClose|onOpen|onInit|onChange|onDestroy)`
- `handler : function (A handler function previously attached for the event)`

**Example**

```js
const onSelectHandler = function(params){
   const {currentSelectedTabId , perviousSelectedTabId} = params;
   // can use 'this' here which refers to the instance
   this.off('onSelect', onSelectHandler);
};
instance.on('onSelect', onSelectHandler);
```

### getCopyData

Return value : Object

**Example**

```js
const { selectedTabID , openTabIDs } = instance.getCopyData();
```


## tabData


<table>
  <tbody>
    <tr>
      <th>property name</th>
      <th>type</th>
      <th>default value</th>
      <th>required</th>
    </tr>
    <tr>
      <td>id</td>
      <td>string</td>
      <td></td>
      <td>false</td>
    </tr>
    <tr>
      <td>title</td>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
    </tr>
    <tr>
      <td>tooltip</td>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
    </tr>
    <tr>
      <td>panelComponent</td>
      <td>can be either of React Element or React Component</td>
      <td></td>
      <td>false</td>
    </tr>
    <tr>
      <td>closable</td>
      <td>boolean</td>
      <td>true</td>
      <td>false</td>
    </tr>
    <tr>
      <td>iconClass</td>
      <td>string</td>
      <td>' '</td>
      <td>false</td>
    </tr>
    <tr>
      <td>disable</td>
      <td>boolean</td>
      <td>false</td>
      <td>false</td>
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
    iconClass : 'fa fa-home',
    closable: false,
    panelComponent: porps => <p> contact content </p>
};
 const [ TabList , PanelList , instance ] = useDynTabs( { tabs : [tabData] } );
 // or
 if(instance.isOpen(tabData.id) == false ){
    instance.open(tabData).then(()=>{});
 }
```


## Lazy Loading

upcoming...


## Styling

react-dyn-tabs does not include any style loading by default. Default stylesheets and themes are provided and can be included in your application if desired.


```js
import 'react-dyn-tabs/style/react-dyn-tabs.css';
import 'react-dyn-tabs/themes/default.css';
```


## Caveats

Some actions like open, select, close and refresh cause re-rendering, 
 and using them immediately after calling useDynTabs hook will create an infinite loop and other bugs that most likely you don't want to cause.
you should use them inside event listeners or subscriptions.


## Test

```js
$ npm run test
```


## License

MIT

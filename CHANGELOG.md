# v6.2.1

- Fix tablistStyle issue when when adding MoreButtonPlgin
- Improve document
- Fix type issue of `MoreButtonPlugin`
- Update demo

# v6.2.0

Adding new option `tablistStyle`

# v6.1.1

- Fix `ssr` rendering issue of `element-resize-detector` package

# v6.1.0

- new `theme` option
- update `demo`
- fix issue of `bootstrap` theme

# v6.0.1

Fix issue of `components` reference

# v6.0.0

- Responsive with `more button plugin`
- `Tablist` accepts children
- Remove Deprecated features :
  - Now `ready` function can not be used as an `object`
  - Remove Deprecated parameter of `onSelect` option
  - Remove Deprecated parameter of `onChange` option

# v5.1.1

- Fix types

# v5.1.0

- Adding types

# V5.0.0

- Update peerDependencies

# v4.7.0

- Adding sort method

# v4.6.0

- Adding lazy property into tabData object

- Provide an example for lazy loading

# v4.5.0

- Adding onFirstSelect event

# v4.3.0

- Passing handlers with same reference to instance.on method can prevent of attaching an event handler multiple times.

# v4.2.1

- Correct main style

- Adding some themes

- Correct description of setTab method in readme

# v4.0.0

- Add getData method, a new version of getCopyData method.

- Add getPreviousData method, a new version of getCopyPerviousData method.

- First parameter of onSelect function is an object and has perviousSelectedTabId property which is deprecated. you should use previousSelectedTabId property instead of perviousSelectedTabId property.

- First parameter of onChange function is an object and has perviousData property which is deprecated. you should use previousData property instead of perviousData property.

# v3.1.1

- Since version v3.1.1, returning to last used tab after closing selected tab, should work correctly.

# v3.0.0

- useDynTabs hook returns ready function instead of instance object, as a third element of an array. ( tabs can't be manipulated safely before the first render, use ready() to make a function available after the component is mounted )

- Third element of returned array by useDynTabs hook should not be used as an object, it is no longer recommended and only be kept for backwards compatibility purposes, may be removed in the future. Avoid using it as an object.

- Returned Promise by select|open|close will be resloved after onSelect|onOpen|onClose event

# v2.2.0

- close function can take switching parameter

# v2.1.0

- panel component option can be either of React element or React component

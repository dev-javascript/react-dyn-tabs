# v4.0.0

- add getData method, a new version of getCopyData method.

- add getPreviousData method, a new version of getCopyPerviousData method.

- First parameter of onSelect function is an object and has perviousSelectedTabId property which is deprecated. you should use previousSelectedTabId property instead of perviousSelectedTabId property.

- First parameter of onChange function is an object and has perviousData property which is deprecated. you should use previousData property instead of perviousData property.

# v3.1.1

- since version v3.1.1, returning to last used tab after closing selected tab, should work correctly.

# v3.0.0

- useDynTabs hook returns ready function instead of instance object, as a third element of an array. ( tabs can't be manipulated safely before the first render, use ready() to make a function available after the component is mounted )

- Third element of returned array by useDynTabs hook should not be used as an object, it is no longer recommended and only be kept for backwards compatibility purposes, may be removed in the future. Avoid using it as an object.

- Returned Promise by select|open|close will be resloved after onSelect|onOpen|onClose event

# v2.2.0

- close function can take switching parameter

# v2.1.0

- panel component option can be either of React element or React component

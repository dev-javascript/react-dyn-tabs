
//ApiContext must be mutable so it will not change over the user interactions
//any of tabs should not is called when there is a sideEffect because they're pureComponent.
//tabList should not is called when there is a sideEffect because they're pureComponent.
//garantee for afterSwitchTab
//each tab must has a related panel element on the page with related and computed id
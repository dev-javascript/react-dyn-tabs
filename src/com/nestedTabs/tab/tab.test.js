//performance => pureComponent
//each tab must has a related panel element on the page with related and computed id

//activeTabId should will be change when some tab is clicked
//close when click *

//mutate option.events
//garantee for afterActiveTab event
//garantee for onMount and onUnMount and didUpdate event

//none active tabs must be hidden + active tab class must be visible

//active tab must has a 'active' class + user defined class for active tab.
//all tabs must have default class + user defined class for default class.
//none active tabs elements must not have active class

//handle appropiate event for switching between tabs includs ['onclick','onmousedown','onmouseup']
//handle appropiate event for close tab includs ['onclick','onmousedown','onmouseup']

//recieve props id with string type
//tab must has at least a title and panelComponent data

//getSnapshot => it must return li element which has an id attribute
//if is it closable then it must has close component

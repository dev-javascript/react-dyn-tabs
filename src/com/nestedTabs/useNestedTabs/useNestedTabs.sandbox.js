import useNestedTabs from "./useNestedTabs.js";
const setting = {
	data: {
		allTabs: [
			{
				id: "",
				title: "",
				tooltip: title,
				panelComponent: null,
				closable: true,
				iconClass: "",
			},
		],
		openTabsId: [],
		activeTabId: null,
	},
	classNames: {
		tabList: "",
		panelList: "",
		tab: "",
		hoverTab: "",
		activeTab: "",
		hoverActiveTab: "",
		closeIcon: "",
		hoverCloseIcon: "",
		panel: "",
		activePanel: "",
	},
	events: {
		onMouseDownTab: null,
		onClickTab: null,
		beforeActiveTab: null,
		afterActiveTab: null,
		beforeDeactiveTab: null,
		afterDeactiveTab: null,

		tabDidMount: null,
		tabDidUpdate: null,
		tabWillUnMount: null,

		onMouseDownTabCloseIcon: null,
		onClickTabCloseIcon: null,
		beforeCloseTab: null,
		afterClosetab: null,

		allTabsDidMount: null,
		allTabsDidUpdate: null,
		allTabsWillUnMount: null,
		onSwitchTabs: null,
		onChangeOpenTabs: null,

		afterOpenTab: null,
	},
	responsiveMode: "icon/moveable/buttonMenu/none",
	switchTabMode: "hover/onClick/onMouseDown/onMouseUp",
};
const [components, api] = useNestedTabs(setting);
const {
	reset, //()=>{}
	reactNative, //
	forceReRenderTab, //
	customStyleProps, //
	getData, //()=>{opentTabsId,activeTabId,allTabs}
	component, //[]
	setData, //({opentTabsId,activeTabId})=>{opentTabsId,activeTabId}
	setEvent, //: function (eventName, callback) { },
	openTabById, //:function(tabId){},
	closeTabById, //:function(tabId){}
} = api;
debugger;

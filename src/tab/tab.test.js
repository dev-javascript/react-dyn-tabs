// import React, { useState } from "react";
// import ReactDom from "react-dom";
// import Tab from "./tab";
// import { act } from "react-dom/test-utils";
// import renderer from 'react-test-renderer';
// let container = document.createElement("div"),
// 	realUseContext;
// const defaultApi = {
// 	stackedEvent: { afterActiveTab: [] },
// 	tabDidUpdate: jest.fn(({ tabId, isSelected, isFirstCall }) => { }),
// 	tabDidMount: jest.fn(({ tabId, isSelected }) => { }),
// 	activeTabEventHandler: jest.fn(() => { }),
// },
// 	getMockOptions = () => () => ({
// 		data: {
// 			allTabs: {
// 				"1": { id: 1, title: "a1" },
// 				"2": { id: 2, title: "a3" },
// 				"3": { id: 3, title: "a2" },
// 			},
// 		},
// 		cssClasses: {
// 			tab: "rdlt-default-tab defaultTab",
// 			activeTab: "rdlt-active-tab activeTab"
// 		},
// 	}),
// 	setMockUseContext = (api) => {
// 		React.useContext = jest.fn(() => Object.assign({}, defaultApi, api || {}));
// 	};
// beforeAll(() => {
// 	document.body.appendChild(container);
// 	realUseContext = React.useContext;
// });
// beforeEach(() => {
// 	setMockUseContext({ getOptions: getMockOptions() });
// });
// afterEach(() => {
// 	ReactDom.unmountComponentAtNode(container);
// 	container.innerHTML = "";
// 	React.useContext = realUseContext;
// });
// afterAll(() => {
// 	document.body.removeChild(container);
// 	container = null;
// });
// test("tab component must expect id and selectedTabID as a props", () => {
// 	act(() => {
// 		ReactDom.render(<>
// 			<Tab id="1" selectedTabID="1"></Tab>
// 			<Tab id="2" selectedTabID="1"></Tab>
// 		</>, container);
// 	});
// 	const tab1El = document.getElementById("tab_1"), tab2El = document.getElementById("tab_2");
// 	expect(tab1El).not.toBe(null);
// 	expect(tab2El).not.toBe(null);
// 	expect(tab1El.className.includes('active')).toBe(true);
// 	expect(tab2El.className.includes('active')).toBe(false);
// });
// describe("tab classes", () => {
// 	test(`only activeTab must have an "rdlt-active-tab" class and all tabs must have a 
// 	    "rdlt-default-tab" class`, () => {
// 		act(() => {
// 			ReactDom.render(
// 				<>
// 					<Tab id="1" selectedTabID="1"></Tab>
// 					<Tab id="2" selectedTabID="1"></Tab>
// 				</>,
// 				container
// 			);
// 		});
// 		const t1c = document.getElementById("tab_1").className,
// 			t2c = document.getElementById("tab_2").className;
// 		expect(t1c.includes("rdlt-active-tab")).toBe(true);
// 		expect(t1c.includes("rdlt-default-tab")).toBe(true);
// 		expect(t2c.includes("rdlt-active-tab")).toBe(false);
// 		expect(t2c.includes("rdlt-default-tab")).toBe(true);
// 	});
// 	test('tab may have some user defined classes like "activeTab" and "defaultTab"', () => {
// 		act(() => {
// 			ReactDom.render(
// 				<>
// 					<Tab id="1" selectedTabID="1"></Tab>
// 					<Tab id="2" selectedTabID="1"></Tab>
// 				</>,
// 				container
// 			);
// 		});
// 		const tab1El = document.getElementById("tab_1"), tab2El = document.getElementById("tab_2");
// 		expect(tab1El.className.includes("activeTab")).toBe(true);
// 		expect(tab1El.className.includes("defaultTab")).toBe(true);
// 		expect(tab2El.className.includes("defaultTab")).toBe(true);
// 		expect(tab2El.className.includes("activeTab")).toBe(false);
// 	});
// });
// describe("tab mouse events", () => {
// 	test(`tab must implement mousedown, click and mouseup events and all of them must call 
//           activeTabEventHandler`, () => {
// 		const activeTabEventHandler = jest.fn(() => { });
// 		setMockUseContext({ getOptions: getMockOptions(), activeTabEventHandler });
// 		act(() => {
// 			ReactDom.render(
// 				<>
// 					<Tab id="1" selectedTabID="1"></Tab>
// 					<Tab id="2" selectedTabID="1"></Tab>
// 				</>,
// 				container
// 			);
// 		});
// 		const tab1El = document.getElementById("tab_1"),
// 			tab2El = document.getElementById("tab_2");
// 		const e0 = new MouseEvent("mousedown", { bubbles: true }),
// 			e6 = new MouseEvent("mouseup", { bubbles: true });
// 		tab1El.dispatchEvent(e0);
// 		tab1El.dispatchEvent(new MouseEvent("click", { bubbles: true }));
// 		tab1El.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
// 		tab2El.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
// 		tab2El.dispatchEvent(new MouseEvent("click", { bubbles: true }));
// 		tab2El.dispatchEvent(e6);
// 		expect(activeTabEventHandler).toHaveBeenCalledTimes(6);
// 		expect(activeTabEventHandler.mock.calls[0][1]).toBe('1');
// 		expect(activeTabEventHandler.mock.calls[5][1]).toBe('2');
// 	});
// });
// describe("calling tabDidMount and tabDidUpdate  inside the useEffect", () => {
// 	test(`tabDidMount will be called just one time during the executions of tabComponent`, () => {
// 		const tabDidMount = jest.fn(({ tabId, isSelected }) => { });
// 		setMockUseContext({ getOptions: getMockOptions(), tabDidMount });
// 		act(() => {
// 			ReactDom.render(
// 				<>
// 					<Tab selectedTabID="2" id="1"></Tab>
// 					<Tab selectedTabID="2" id="2"></Tab>
// 				</>,
// 				container
// 			);
// 		});
// 		act(() => {
// 			document.getElementById("tab_1").dispatchEvent(new MouseEvent("clik", { bubbles: true }));
// 			document.getElementById("tab_2").dispatchEvent(new MouseEvent("clik", { bubbles: true }));
// 		});
// 		expect(tabDidMount).toHaveBeenCalledTimes(2);
// 		expect(tabDidMount).toHaveBeenNthCalledWith(1, { id: "1", isSelected: false });
// 		expect(tabDidMount).toHaveBeenNthCalledWith(2, { id: "2", isSelected: true });
// 	});
// 	test(`tabDidUpdate must  will be called in the first execution of tabComponent`, () => {
// 		const tabDidUpdate = jest.fn(({ tabId, isSelected, isFirstCall }) => { }),
// 			tabDidMount = jest.fn(({ tabId, isSelected }) => { });
// 		setMockUseContext({ getOptions: getMockOptions(), tabDidMount, tabDidUpdate });
// 		act(() => {
// 			ReactDom.render(
// 				<>
// 					<Tab selectedTabID="2" id="1"></Tab>
// 					<Tab selectedTabID="2" id="2"></Tab>
// 				</>,
// 				container
// 			);
// 		});
// 		expect(tabDidUpdate).toHaveBeenCalledTimes(2);
// 		expect(tabDidUpdate).toHaveBeenNthCalledWith(1, { id: "1", isSelected: false, isFirstCall: true });
// 		expect(tabDidUpdate).toHaveBeenNthCalledWith(2, { id: "2", isSelected: true, isFirstCall: true });
// 	});
// 	test(`tabDidUpdate will be called twice for switching between tabs, one for activeTab component
// 	       and another one for deselectTab component(old activeTabComponent)`, () => {
// 		const tabDidUpdate = jest.fn(({ tabId, isSelected, isFirstCall }) => { }),
// 			tabDidMount = jest.fn(({ tabId, isSelected }) => { });
// 		setMockUseContext({ getOptions: getMockOptions(), tabDidMount, tabDidUpdate });
// 		function MockWrapprTab() {
// 			const [activeId, setActiveId] = useState({ id: '2' }), toggelActiveTab = (e) => {
// 				activeId === '2' ? setActiveId('1') : setActiveId('2');
// 			}, refresh = id => { setActiveId({ id }); };
// 			return <>
// 				<button id='toggelActiveTabBtn' onClick={toggelActiveTab}></button>
// 				<button id='forceUpdateBtn' onClick={refresh}></button>
// 				<Tab selectedTabID={activeId} id="1"></Tab>
// 				<Tab selectedTabID={activeId} id="2"></Tab>
// 				<Tab selectedTabID={activeId} id="3"></Tab>
// 			</>;
// 		}
// 		act(() => { ReactDom.render(<MockWrapprTab></MockWrapprTab>, container); });
// 		const toggelActiveTabBtn = document.getElementById('toggelActiveTabBtn'),
// 			forceUpdateBtn = document.getElementById('forceUpdateBtn');
// 		act(() => { toggelActiveTabBtn.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
// 		act(() => { toggelActiveTabBtn.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
// 		act(() => { forceUpdateBtn.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
// 		expect(tabDidUpdate).toHaveBeenCalledTimes(7);
// 		expect(tabDidUpdate).toHaveBeenLastCalledWith({ id: '1', isSelected: false, isFirstCall: false });
// 	});
// });
// test('tab component with user defined css class "defualtTab" and "activeTab"', () => {
// 	const tree = renderer.create(
// 		<>
// 			<Tab id='1' selectedTabID='1'></Tab>
// 			<Tab id='2' selectedTabID='1'></Tab>
// 		</>
// 	).toJSON();
// 	expect(tree).toMatchSnapshot();
// });
// test('selectedTabID props can be passed as an empty string into tab component', () => {
// 	const tree = renderer.create(
// 		<Tab id='1' selectedTabID=''></Tab>
// 	).toJSON();
// 	expect(tree).toMatchSnapshot();
// });
// //user defined hover class
// //mock getId function

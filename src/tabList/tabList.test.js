import React from "react"
import { unmountComponentAtNode } from "react-dom";
import TabList from "./tabList.js";
import renderer from 'react-test-renderer';
import Api from '../utils/api/api.js';
let container = document.createElement("div"), realUseContext;
const getDefaultApi = () => ({
    tabs: [
        { id: '1', title: 'tab1' },
        { id: '2', title: 'tab2' },
    ],
    selectedTabID: '1'
});
const setMockUseContext = (op = {}) => {
    const defaultOp = getDefaultApi();
    const instance = new (Api)({ options: Object.assign({}, defaultOp, op) });
    instance.openTabIDs = ['1', '2'];
    instance.selectedTabID = '1';
    React.useContext = jest.fn(() => instance);
};
beforeAll(() => {
    document.body.appendChild(container);
    realUseContext = React.useContext;
});
beforeEach(() => { });
afterEach(() => {
    unmountComponentAtNode(container);
    container.innerHTML = "";
    React.useContext = realUseContext;
});
afterAll(() => {
    document.body.removeChild(container);
    container = null;
});
describe('TabList structure : ', () => {
    test('default options', () => {
        setMockUseContext();
        const tree = renderer
            .create(<div>
                <TabList></TabList>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('rtl option', () => {
        setMockUseContext({ direction: 'rtl' });
        const tree = renderer
            .create(<div>
                <TabList></TabList>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('none accessibility option', () => {
        setMockUseContext({ accessibility: false });
        const tree = renderer
            .create(<div>
                <TabList></TabList>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});



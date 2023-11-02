import React, { FunctionComponent } from 'react';
export type Callback = (instance: Instance) => void;
/**
 * - ready function accepts a callback as its parameter and executes it as soon as Tabs get mounted.

 * - If ready function is called after the Tabs has been mounted, the callback passed in will be executed immediately.

 * - ready function can be executed multiple times and its identity is stable and won’t change on re-renders.
 */
export type Ready = (callback: Callback) => void;
export interface TabProps {
    'tab-id': string;
    className: string;
    title: string;
    tabIndex: number;
    id?: string;
    role?: string;
}
export interface IconProps {
    className: string;
    role: string;
}
export interface TabComponentProps {
    id: string;
    isSelected: boolean;
    api: Instance;
    tabProps: TabProps;
    iconProps?: IconProps;
}
export interface Options {
    /** * default value is "ltr"*/
    direction?: 'rtl' | 'ltr';
    defaultPanelComponent?: () => FunctionComponent<{ id: string, isSelected: boolean, api: Instance }> | null;
    tabComponent?: FunctionComponent<TabComponentProps>;
    selectedTabID?: string;
    tabs?: Array<TabData>;
    /**     * default value is true     */
    accessibility?: boolean;
    /**     * default value is false     */
    isVertical?: boolean;
    onLoad?: () => void;
    onInit?: () => void;
    onChange?: ({ currentData, previousData, closedTabIDs, openedTabIDs }: { currentData: any, previousData: any, closedTabIDs: Array<string>, openedTabIDs: Array<string> }) => void;
    /**     * defautl value function returns true     */
    beforeSelect?: (e: React.MouseEvent<HTMLElement>, id: string) => boolean;
    onFirstSelect?: ({ currentSelectedTabId, previousSelectedTabId }: { currentSelectedTabId: string, previousSelectedTabId: string }) => void;
    onSelect?: ({ currentSelectedTabId, previousSelectedTabId }: { currentSelectedTabId: string, previousSelectedTabId: string }) => void;
    onOpen?: (openedTabIDs: Array<string>) => void;
    /**     * defautl value function returns true     */
    beforeClose?: (e: React.MouseEvent<HTMLElement>, id: string) => boolean;
    onClose?: (closedTabIDs: Array<string>) => void;
    onDestroy?: () => void;
}
export interface TabData {
    id?: string;
    title?: string;
    tooltip?: string;
    /**     * default value is true     */
    closable?: boolean;
    /**   * default value is false   */
    lazy?: boolean;
    iconClass?: string;
    /**     * default value is false     */
    disable?: boolean;
    panelComponent?: React.ReactElement<any, any> | FunctionComponent<{ id: string, isSelected: boolean, api: Instance }> | null;
    [x: string]: unknown;
}
export interface CurrentData {
    openTabIDs: Array<string>;
    selectedTabID: string;
}
export interface Instance {
    isOpen: (tabID: string) => boolean;
    open: (tabData: TabData) => Promise<{ currentData: CurrentData, instance: Instance }>;
    isSelected: (tabID: string) => boolean;
    select: (tabID: string) => Promise<{ currentData: CurrentData, instance: Instance }>;
    /**
     * - When switching parameter is true, it switches to previous selected tab
     */
    close: (tabID: string, switching?: boolean) => Promise<{ currentData: CurrentData, instance: Instance }>;
    refresh: () => Promise<{ currentData: CurrentData, instance: Instance }>;
    getOption: (optionName: string) => any;
    setOption: (optionName: string, optionValue: any) => Instance;
    getTab: (tabID: string) => TabData;
    setTab: (tabID: string, sourceObject: TabData) => Instance;
    on: (eventName: string, handler: Function) => Instance;
    one: (eventName: string, handler: Function) => Instance;
    off: (eventName: string, handler: Function) => Instance;
    getData: () => TabData;
    getPreviousData: () => TabData;
    sort: (tabIDs: Array<string>) => Promise<{ currentData: CurrentData, instance: Instance }>;
}
type Tablist = FunctionComponent<{}>;
type Panellist = FunctionComponent<{}>;
export const TabList: Tablist;
export const PanelList: Panellist;
declare const useDynTabs: (options?: Options) => [Tablist, Panellist, Ready];
export default useDynTabs;
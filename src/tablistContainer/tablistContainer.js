import React, {useContext, memo} from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
import Tablist from '../tabList/tabList.js';
import TabIndicator from '../tabIndicator/tabIndicator.js';
const TabListContainer = memo(
  function TabListContainer() {
    useContext(ForceUpdateContext);
    const api = useContext(ApiContext),
      {
        moreButtonContainerComponent: MoreButtonContainer,
        topScrollButtonComponent: TopScrollButton,
        bottomScrollButtonComponent: BottomScrollButton,
      } = api,
      {scrollContainerClass, tablistContainerClass, tabIndicatorContainerClass} = api.optionsManager.setting;
    return (
      <div className={scrollContainerClass}>
        <TopScrollButton></TopScrollButton>
        <div className={tablistContainerClass}>
          <div className={tabIndicatorContainerClass}>
            <MoreButtonContainer>
              <Tablist></Tablist>
            </MoreButtonContainer>
            <TabIndicator></TabIndicator>
          </div>
        </div>
        <BottomScrollButton></BottomScrollButton>
      </div>
    );
  },
  () => true,
);
export default TabListContainer;

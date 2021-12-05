import React, {useContext, memo, createRef, useEffect} from 'react';
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
      tablistContainerRef = createRef(),
      {scrollContainerClass, tablistContainerClass, tabIndicatorContainerClass} = api.optionsManager.setting;
    useEffect(() => {
      api.trigger('_onTablistContainerMount', api.userProxy, () => [tablistContainerRef]);
    }, []);
    return (
      <div className={scrollContainerClass}>
        <TopScrollButton />
        <div className={tablistContainerClass} ref={tablistContainerRef}>
          <div className={tabIndicatorContainerClass}>
            <MoreButtonContainer>
              <Tablist />
            </MoreButtonContainer>
            <TabIndicator />
          </div>
        </div>
        <BottomScrollButton />
      </div>
    );
  },
  () => true,
);
export default TabListContainer;

import React from 'react';
//import useDynTabs from 'react-dyn-tabs/dist/react-dyn-tabs.umd.js';
import useDynTabs from 'react-dyn-tabs';
import service from './service/index.js';
import './index.css';
export default function (props) {
  const options = service.getLocalData();
  const [Tablist, Panellist, api] = useDynTabs(options);
  return (
    <>
      <Tablist></Tablist>
      <Panellist></Panellist>
    </>
  );
}

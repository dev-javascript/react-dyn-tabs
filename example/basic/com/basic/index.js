import React from 'react';
//import useDynTabs from 'react-dyn-tabs/dist/react-dyn-tabs.umd.js';
import useDynTabs from 'react-dyn-tabs';
import service from './service/index.js';
import './index.css';
export default function Basic() {
  const options = service.getLocalData();
  const [Tablist, Panellist, ready] = useDynTabs(options);
  return (
    <>
      <Tablist></Tablist>
      <Panellist></Panellist>
    </>
  );
}

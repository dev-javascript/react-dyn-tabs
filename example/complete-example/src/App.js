import React from 'react';
import './App.css';
import Tabs from './components/tabs/tabs.js';
function App() {
  return (
    <>
      <div id="header">
        <a href="https://github.com/dev-javascript/react-dyn-tabs" target="_blank">
          <h1>react-dyn-tabs</h1>
        </a>
      </div>
      <Tabs />
    </>
  );
}

export default App;

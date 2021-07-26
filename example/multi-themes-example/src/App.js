import React from 'react';
import './App.css';
import Tabs from './components/simple-tabs/simple-tabs.js';
import useSelectTheme from './components/useSelectTheme/useSelectTheme.js';
function App() {
  const [ThemeSelectorComponent, scopeSelector] = useSelectTheme();
  return (
    <>
      <div id="header">
        <a href="https://github.com/dev-javascript/react-dyn-tabs" target="_blank">
          <h1>react-dyn-tabs</h1>
        </a>
        <ThemeSelectorComponent></ThemeSelectorComponent>
      </div>
      <div className={scopeSelector}>
        <Tabs />
      </div>
    </>
  );
}

export default App;

import React, {useState, useCallback} from 'react';
import './themeSelector.css';
const useSelectTheme = (props) => {
  const [scopeSelector, setScopeSelector] = useState('card');
  const onChangeTheme = (e) => {
    setScopeSelector(e.target.value);
  };
  const ThemeSelector = useCallback(
    (props) => (
      <div id="theme-container">
        <label htmlFor="theme-selector">Theme : </label>
        <select id="theme-selector" onChange={onChangeTheme} value={scopeSelector}>
          <option key="2" value="card">
            card
          </option>
          <option key="1" value="bootstrap">
            bootstrap
          </option>
          <option key="3" value="basic">
            basic
          </option>
          <option key="4" value="classic">
            classic
          </option>
        </select>
      </div>
    ),
    [scopeSelector],
  );
  return [ThemeSelector, scopeSelector];
};
export default useSelectTheme;

import { useEthersContext } from 'eth-hooks/context';
import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';

export const ThemeSwitcher = () => {
  const theme = window.localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState(!(!theme || theme === 'light'));
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();
  const ethersContext = useEthersContext();

  useEffect(() => {
    window.localStorage.setItem('theme', currentTheme ?? '');
    if (currentTheme == 'light' || currentTheme == 'dark') {
      ethersContext?.setModalTheme?.(currentTheme);
    }
  }, [currentTheme]);

  const toggleTheme = (isChecked: boolean) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
    ethersContext?.setModalTheme?.(isDarkMode ? 'dark' : 'light');
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
    <div className="main fade-in" style={{ position: 'fixed', right: 10, bottom: 10 }}>
      <span style={{ padding: 8 }}>{currentTheme === 'light' ? '☀️' : '🌜'}</span>
      <Switch checked={isDarkMode} onChange={toggleTheme} />
    </div>
  );
};

import { FC } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { ThemeSwitcher } from '~~/components/common';

export const MainPageRightFooter: FC = () => {
  return <ThemeSwitcher />;
};

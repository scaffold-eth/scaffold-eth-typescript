import { TEthersUser } from 'eth-hooks/models';
import { FC } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { ThemeSwitcher } from '~~/components/common';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

interface IMainPageRightFooter {
  scaffoldAppProviders: IScaffoldAppProviders;
  currentEthersUser: TEthersUser;
}

export const MainPageRightFooter: FC<IMainPageRightFooter> = () => {
  return <ThemeSwitcher />;
};

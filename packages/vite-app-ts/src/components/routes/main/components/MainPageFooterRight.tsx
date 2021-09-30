import { TEthersUser } from 'eth-hooks/models';
import { FC } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { ThemeSwitcher } from '~~/components/common';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

interface IMainPageFooterRight {
  scaffoldAppProviders: IScaffoldAppProviders;
  currentEthersUser: TEthersUser;
}

export const MainPageFooterRight: FC<IMainPageFooterRight> = () => {
  return <ThemeSwitcher />;
};

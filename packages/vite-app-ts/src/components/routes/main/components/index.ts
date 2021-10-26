import { lazier } from 'eth-hooks/helpers';

export const MainPageContracts = lazier(() => import('./MainPageContracts'), 'MainPageContracts');
export const MainPageFooter = lazier(() => import('./MainPageFooter'), 'MainPageFooter');
export const MainPageHeader = lazier(() => import('./MainPageHeader'), 'MainPageHeader');
export const MainPageMenu = lazier(() => import('./MainPageMenu'), 'MainPageMenu');

import { lazier } from 'eth-hooks/helpers';

// use lazy/lazier for react lazy loading

/**
 * lazy/lazier loaded component
 */
export const MainPageFooter = lazier(() => import('./MainPageFooter'), 'MainPageFooter');
/**
 * lazy/lazier loaded component
 */
export const MainPageHeader = lazier(() => import('./MainPageHeader'), 'MainPageHeader');

export * from './createPagesAndTabs';

import { lazier } from 'eth-hooks/helpers';

// the components and pages are lazy loaded for performance and bundle size reasons
// code is in the component file

export const Subgraph = lazier(() => import('./subgraph/Subgraph'), 'Subgraph');

import { contractsContextFactory } from 'eth-hooks/context';

import { getAppContractsConfig } from '~common/config';

/**
 * This file initalises the contractContextFactory and exports the types
 * 🙅🏽‍♂️ You don't need to change this file.
 */

/**
 * ### Summary
 * This type describes all your contracts, it is the return of {@link getgetAppContractsConfig}
 */
export type TAppConnectorList = NonNullable<ReturnType<typeof getAppContractsConfig>>;

/**
 * #### Summary
 * Call contractContextFactory with the `getAppContractsConfig` from `appContracts.config.ts`
 *
 * ##### Notes
 * - This will create your ContractContext used by App.tsx
 * - This will create your hooks to access contracts
 * - The type is your contract connect config.
 */
export const { useAppContracts, useLoadAppContracts, useConnectAppContracts, useContractsAppStore } =
  contractsContextFactory<keyof TAppConnectorList, TAppConnectorList>(getAppContractsConfig);

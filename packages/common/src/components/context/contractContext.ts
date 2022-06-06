import { contractsContextFactory } from 'eth-hooks/context';
import { TTypedContract } from 'eth-hooks/models';

import { appContractsConfig } from '~common/config';

/**
 * This file initalises the contractContextFactory and exports the types
 * 🙅🏽‍♂️ You don't need to change this file.
 */

/**
 * ### Summary
 * This type describes all your contracts, it is the return of {@link appContractsConfig}
 */
export type TAppConnectorList = NonNullable<ReturnType<typeof appContractsConfig>>;

/**
 * #### Summary
 * Call contractContextFactory with the `appContractsConfig` from `appContracts.config.ts`
 *
 * ##### Notes
 * - This will create your ContractContext used by App.tsx
 * - This will create your hooks to access contracts
 * - The type is your contract connect config.
 */
export const {
  ContractsAppContext,
  useAppContractsActions,
  useAppContracts,
  useLoadAppContracts,
  useConnectAppContracts,
} = contractsContextFactory<
  keyof TAppConnectorList,
  TAppConnectorList,
  TTypedContract<keyof TAppConnectorList, TAppConnectorList>
>(appContractsConfig);

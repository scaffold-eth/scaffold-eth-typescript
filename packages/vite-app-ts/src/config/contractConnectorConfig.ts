import { THardhatContractsFileJson } from 'eth-hooks/models';

import { YourContract__factory } from '~~/generated/contract-types/factories/YourContract__factory';

import { externalContractsAddressMap } from './externalContractsConfig';

/**
 * Run `yarn build:contracts` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
import * as externalContracts from '~~/generated/external-contracts/esm/types';

/**
 * Run `yarn compile` and `yarn deploy` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
import hardhatContractsJson from '../generated/hardhat_contracts.json';
import { createConnectorsForExternalContract, createConnectorsForHardhatContracts } from 'eth-hooks/context';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. edit externalContractList.ts to add your external contract addresses.
 * 2. edit `loader` function below and add them to the list
 * 3. run yarn compile `yarn build:contracts` to generate types for contracts
 * 4. run `yarn deploy` to generate hardhat_contracts.json
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const contractConnectorConfig = () => {
  try {
    const result = {
      // 🙋🏽‍♂️ Add your hadrdhat contracts here
      YourContract: createConnectorsForHardhatContracts('YourContract', YourContract__factory, hardhatContractsJson),

      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`
      DAI: createConnectorsForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),
      UNI: createConnectorsForExternalContract('UNI', externalContracts.UNI__factory, externalContractsAddressMap),
    } as const;

    return result;
  } catch (e) {
    console.error(
      '❌ contractConnectorConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!',
      e
    );
  }

  return undefined;
};

/**
 * ### Summary
 * This type describes all your contracts, it is the return of {@link contractConnectorConfig}
 */
export type TAppConnectorList = NonNullable<ReturnType<typeof contractConnectorConfig>>;

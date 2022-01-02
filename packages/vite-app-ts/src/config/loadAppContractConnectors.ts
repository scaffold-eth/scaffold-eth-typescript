import { THardhatContractsFileJson } from 'eth-hooks/models';

import { YourContract__factory } from '~~/generated/contract-types/factories/YourContract__factory';

import { externalContractsAddressMap } from './externalContractsConfig';

/**
 * Run `yarn build:contracts` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
import * as externalContracts from '~~/generated/external-contracts/esm/types';
import { createConnectorsForExternalContract, createConnectorsForHardhatContracts } from 'eth-hooks/functions';

/**
 * Run `yarn compile` and `yarn deploy` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
const hardhatContractJsonPromise = import('../generated/hardhat_contracts.json');

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. run yarn compile yarn deploy to generate hardhat_contracts.json
 * 2. run yarn build:contracts to generate types for external contracts
 * 3. edit externalContractList.ts to add your external contract addresses.
 * 4. edit `loader` function below and add them to the list
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
const appContractConnectors = (hardhatJson: THardhatContractsFileJson) => {
  try {
    const result = {
      // 🙋🏽‍♂️ Add your hadrdhat contracts here
      YourContract: createConnectorsForHardhatContracts('YourContract', YourContract__factory, hardhatJson),

      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`
      DAI: createConnectorsForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),
      UNI: createConnectorsForExternalContract('UNI', externalContracts.UNI__factory, externalContractsAddressMap),
    } as const;

    return result;
  } catch (e) {
    console.error(
      '❌ ERROR with loading contracts please run `yarn compile`, `yarn deploy`, `yarn build:contracts`!',
      e
    );
  }

  return undefined;
};

/**
 * ### Summary
 * This type describes all your contracts, it is the return of {@link appContractConnectors}
 */
export type TAppConnectorList = NonNullable<ReturnType<typeof appContractConnectors>>;

/**
 * LoadsAppContractsAsync: 🙋🏽‍♂️ Edit your contract definition here!!!
 * ### Summary
 * See {@link loadAppContractConnectors} to add contracts and definitions
 * A helper function to load the app contracts async
 *
 * @returns
 */
export const loadAppContractConnectors = async (): Promise<TAppConnectorList | undefined> => {
  const hardhatJson = ((await hardhatContractJsonPromise).default ?? {}) as unknown as THardhatContractsFileJson;
  return appContractConnectors(hardhatJson);
};

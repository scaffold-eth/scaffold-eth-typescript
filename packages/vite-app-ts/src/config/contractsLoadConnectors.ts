import { THardhatContractsFileJson } from 'eth-hooks/models';

import { YourContract__factory } from '~~/generated/contract-types/factories/YourContract__factory';

import { Greeter__factory } from '~~/generated/contract-types/factories/Greeter__factory';

import { externalContractsAddressMap } from './contractsExternal';

/**
 * Run `yarn build:contracts` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
import * as externalContracts from '~~/generated/external-contracts/types';
import { createConnectorsForExternalContract, createConnectorsForHardhatContracts } from '.yalc/eth-hooks/functions';

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
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
const contractsLoadConnectors = (hardhatJson: THardhatContractsFileJson) => {
  try {
    // ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
    // add your contracts to the list here
    // you need to define them in externalContractList.ts

    const result = {
      // 🙋🏽‍♂️ Add your hadrdhat contracts here
      YourContract: createConnectorsForHardhatContracts('YourContract', YourContract__factory, hardhatJson),
      Greeter: createConnectorsForHardhatContracts('Greeter', Greeter__factory, hardhatJson),

      // 🙋🏽‍♂️ Add your external contracts here
      DAI: createConnectorsForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),
      UNI: createConnectorsForExternalContract('UNI', externalContracts.UNI__factory, externalContractsAddressMap),
    } as const;

    return result;
  } catch {
    console.error('😶 ERROR with loading contracts please run `yarn compile`, `yarn deploy`, `yarn compile:external`!');
  }

  return undefined;
};

/**
 * ### Summary
 * This type describes all your contracts, it is the return of {@link contractsLoadConnectors}
 */
export type TAppContractConnectors = NonNullable<ReturnType<typeof contractsLoadConnectors>>;

/**
 * LoadsAppContractsAsync: 🙋🏽‍♂️ Edit your contract definition here!!!
 * ### Summary
 * See {@link loadAppContracts} to add contracts and definitions
 * A helper function to load the app contracts async
 *
 * @returns
 */
export const contractsLoadConnectorsAsync = async () => {
  const hardhatJson = ((await hardhatContractJsonPromise).default ?? {}) as unknown as THardhatContractsFileJson;
  return contractsLoadConnectors(hardhatJson);
};

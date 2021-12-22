import { THardhatContractsFileJson, TTypechainContractFactory } from 'eth-hooks/models';

import { YourContract__factory } from '~~/generated/contract-types/factories/YourContract__factory';

import { Greeter__factory } from '~~/generated/contract-types/factories/Greeter__factory';
import {
  createTypechainContractConnectorForExternalContract,
  createTypechainContractConnectorHardhatContract,
} from 'eth-hooks/functions';
import { externalContractsAddressMap } from './externalContractsAddressMap';

/**
 * Run `yarn build:contracts` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
import * as externalContracts from '~~/generated/external-contracts/types';
import { argsToArgsConfig } from 'graphql/type/definition';
/**
 * Run `yarn compile` and `yarn deploy` to generate the external types
 * edit: externalContractAddressMap.ts file to add your own external contracts
 */
const hardhatContractJsonPromise = import('../../generated/hardhat_contracts.json');

/**
 * ### Summary
 * - loader: 🙋🏽‍♂️ Edit your contract definition here!!!
 * - change the return type
 * - 👨🏽‍🏫 follow the directions written in `loadAppContractConnectors` below
 * @returns
 */
const loader = (hardhatJson: THardhatContractsFileJson) => {
  try {
    // 🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️
    // add your contracts to the list here
    // hardhat: is for your contracts: run `yarn compile` `yarn deploy`
    // external: is for contracts like DAI, UNI, etc.
    //  ⛳️ you need to define them in externalContractList.ts

    const result = {
      YourContract: createTypechainContractConnectorHardhatContract('YourContract', YourContract__factory, hardhatJson),
      Greeter: createTypechainContractConnectorHardhatContract('YourContract', Greeter__factory, hardhatJson),
      DAI: createTypechainContractConnectorForExternalContract(
        'DAI',
        externalContracts.DAI__factory,
        externalContractsAddressMap
      ),
      UNI: createTypechainContractConnectorForExternalContract(
        'DAI',
        externalContracts.UNI__factory,
        externalContractsAddressMap
      ),
    };

    return result;
  } catch {
    console.error('😶 ERROR with loading contracts please run `yarn compile`, `yarn deploy`, `yarn compile:external`!');
  }

  return undefined;
};

/**
 * LoadsAppContracts: 🙋🏽‍♂️ Add your contract definition here!!!
 * ### Instructions
 * 1. run yarn compile yarn deploy to generate hardhat_contracts.json
 * 2. run yarn build:contracts to generate types for external contracts
 * 3. edit externalContractList.ts to add your external contracts
 * 4. edit `loader` function's return value to add your contract => 🐇 follow the comments
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const loadAppContractConnectors = async () => {
  const hardhatJson = ((await hardhatContractJsonPromise).default ?? {}) as unknown as THardhatContractsFileJson;
  return loader(hardhatJson);
};

export type TAppContractConnectorList = NonNullable<ReturnType<typeof loader>>;
export type TAppContractNames = keyof TAppContractConnectorList;
export type TAppContractConnector<GContractNames extends TAppContractNames> = TAppContractConnectorList[GContractNames];
export type TAppContract<GContractNames extends TAppContractNames> = ReturnType<
  TAppContractConnectorList[GContractNames]['connect']
>;

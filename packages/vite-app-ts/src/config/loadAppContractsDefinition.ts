import { THardhatContractsFileJson, TAppContractConnectorList, TTypechainContractFactory } from 'eth-hooks/models';

import { YourContract__factory } from '~~/generated/contract-types/factories/YourContract__factory';

import { Greeter__factory } from '~~/generated/contract-types/factories/Greeter__factory';
import { DAI__factory, UNI__factory } from '~~/generated/external-contracts/types';
import {
  createTypechainContractConnectorForExternalContract,
  createTypechainContractConnectorHardhatContract,
} from 'eth-hooks/functions';
import { externalContractList } from './externalContractList';

const hardhatContractJsonPromise = import('../generated/hardhat_contracts.json');

/**
 * LoadsAppContracts: 🙋🏽‍♂️ Add your contract definition here!!!
 *
 * ### Instructions
 * - run yarn compile yarn deploy to generate hardhat_contracts.json
 * - run yarn build:contracts to generate types for external contracts
 * - edit externalContractList.ts to add your external contracts
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const loadAppContractsDefinition = async () => {
  const result: TAppContractConnectorList = {};

  try {
    const hardhatJson = ((await hardhatContractJsonPromise).default ?? {}) as unknown as THardhatContractsFileJson;
    const externalContractDefinition = externalContractList;

    // 🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️
    // add your contracts to the list here
    // hardhat: is for your contracts: run `yarn compile` `yarn deploy`
    // external: is for contracts like DAI, UNI, etc.
    //  ⛳️ you need to define them in externalContractList.ts
    const appContractDefinitions = {
      hardhat: {
        YourContract: createTypechainContractConnectorHardhatContract(
          'YourContract',
          YourContract__factory,
          hardhatJson
        ),
        Greeter: createTypechainContractConnectorHardhatContract('YourContract', Greeter__factory, hardhatJson),
      },
      external: {
        DAI: createTypechainContractConnectorForExternalContract('DAI', DAI__factory, externalContractDefinition),
        UNI: createTypechainContractConnectorForExternalContract('DAI', UNI__factory, externalContractDefinition),
      },
    };

    return appContractDefinitions;
  } catch {
    console.error('😶 ERROR with loading contracts please run `yarn compile`, `yarn deploy`, `yarn compile:external`!');
  }
};

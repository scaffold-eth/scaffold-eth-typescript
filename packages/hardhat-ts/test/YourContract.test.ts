import '../helpers/hardhat-imports';
import './helpers/chai-imports';

import { expect } from 'chai';
import { YourContract__factory } from 'generated/contract-types';
import hre from 'hardhat';
import { getHardhatSigners } from 'tasks/functions/accounts';

import { YourContract } from '../generated/contract-types/YourContract';

describe('YourContract', function () {
  let yourContract: YourContract;
  beforeEach(async () => {
    const { deployer } = await getHardhatSigners(hre);
    const factory = new YourContract__factory(deployer);
    yourContract = await factory.deploy();
  });
  it("Should return the new purpose once it's changed", async function () {
    await yourContract.deployed();
    expect(await yourContract.purpose()).to.equal('Building Unstoppable Apps!!!');

    await yourContract.setPurpose('Hola, mundo!');
    expect(await yourContract.purpose()).to.equal('Hola, mundo!');
  });
});

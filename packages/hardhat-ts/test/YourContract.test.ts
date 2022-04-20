import '../helpers/hardhat-imports';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { expect, use, should } from 'chai';
import { ethers } from 'hardhat';

import { YourContract } from '../generated/contract-types/YourContract';

import './helpers/chai-imports';

describe('YourContract', function () {
  let yourContract: YourContract;
  beforeEach(async () => {
    const factory = await ethers.getContractFactory('YourContract');
    yourContract = (await factory.deploy()) as YourContract;
  });
  it("Should return the new purpose once it's changed", async function () {
    await yourContract.deployed();
    expect(await yourContract.purpose()).to.equal('Building Unstoppable Apps!!!');

    await yourContract.setPurpose('Hola, mundo!');
    expect(await yourContract.purpose()).to.equal('Hola, mundo!');
  });
});

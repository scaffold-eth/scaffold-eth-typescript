import { FakeContract, smock } from '@defi-wonderland/smock';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { YourContract } from '../generated/contract-types/YourContract';

chai.should(); // if you like should syntax
chai.use(smock.matchers);

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

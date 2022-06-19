import '../helpers/hardhat-imports';
import './helpers/chai-imports';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { Contributors, Contributors__factory } from 'api/contract-types';
import hre from 'hardhat';

import { CONTRIBUTORS_DEPLOYMENT } from '../deploy/00_Contributors';

import { IS_REGISTRAR, ONLY_OWNER } from './helpers/errors';

const xhre = hre;
const { deployments, getNamedAccounts, getUnnamedAccounts } = xhre;

describe('Contributors', function () {
  let contributorsContract: Contributors;
  let deployer: SignerWithAddress;
  let contributor: SignerWithAddress;
  let registrar: SignerWithAddress;

  beforeEach(async function () {
    const { deployer: deployerAddress } = await getNamedAccounts();
    const accounts = await getUnnamedAccounts();
    deployer = await xhre.ethers.getSigner(deployerAddress);
    contributor = await xhre.ethers.getSigner(accounts[0]);
    registrar = await xhre.ethers.getSigner(accounts[1]);
    await deployments.fixture([CONTRIBUTORS_DEPLOYMENT]);
    const deployment = await deployments.get(CONTRIBUTORS_DEPLOYMENT);
    contributorsContract = Contributors__factory.connect(deployment.address, deployer);
  });

  it('Should let owner add and remove registrar', async () => {
    await contributorsContract.addRegistrar(registrar.address);
    expect(await contributorsContract.registrars(registrar.address)).to.be.true;
    await contributorsContract.removeRegistrar(registrar.address);
    expect(await contributorsContract.registrars(registrar.address)).to.be.false;
  });

  it('Should only let owner add registrar', async () => {
    await expect(contributorsContract.connect(contributor).addRegistrar(registrar.address)).revertedWith(ONLY_OWNER);
  });

  it('Should only let owner remove registrar', async () => {
    await expect(contributorsContract.connect(contributor).removeRegistrar(registrar.address)).revertedWith(ONLY_OWNER);
  });

  it('Should only let registrar register', async () => {
    await expect(contributorsContract.register('foo', contributor.address)).revertedWith(IS_REGISTRAR);
  });

  describe('Registration process', function () {
    const HASH = 'test';
    beforeEach(async () => {
      await contributorsContract.addRegistrar(registrar.address);
      await contributorsContract.connect(registrar).register(HASH, contributor.address);
    });

    it("Should register the contributor's hash", async () => {
      expect(await contributorsContract.getConfirmationHash(registrar.address, contributor.address)).to.equal(HASH);
    });

    it('Should return empty hash if the contributor is not registered', async () => {
      expect(await contributorsContract.getConfirmationHash(registrar.address, registrar.address)).to.equal('');
    });

    describe('Confirmation process', function () {
      let id: BigNumber;

      beforeEach(async () => {
        await contributorsContract.connect(contributor).confirmRegistration(registrar.address);
        id = await contributorsContract.getTokenIds();
      });

      it('Should mint a contributor NFT', async () => {
        expect(await contributorsContract.ownerOf(id)).to.equal(contributor.address);
      });

      it('Should link to hash', async () => {
        expect(await contributorsContract.tokenURI(id)).to.equal(HASH);
      });
    });
  });
});

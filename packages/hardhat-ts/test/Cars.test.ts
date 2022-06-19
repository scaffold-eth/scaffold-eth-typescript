import '../helpers/hardhat-imports';
import './helpers/chai-imports';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { Cars, Cars__factory } from 'api/contract-types';
import hre from 'hardhat';

import { CARS_DEPLOYMENT } from '../deploy/03_Cars';

import { IS_EXISTENT_TOKEN, CAR_MINTED } from './helpers/errors';
import { equal } from 'assert';

const xhre = hre;
const { deployments, getNamedAccounts, getUnnamedAccounts } = xhre;

describe('Cars', function () {
  let carsContract: Cars;
  let deployer: SignerWithAddress;
  let alice: SignerWithAddress;

  beforeEach(async function () {
    const { deployer: deployerAddress } = await getNamedAccounts();
    const accounts = await getUnnamedAccounts();
    deployer = await xhre.ethers.getSigner(deployerAddress);
    alice = await xhre.ethers.getSigner(accounts[0]);
    await deployments.fixture([CARS_DEPLOYMENT]);
    const deployment = await deployments.get(CARS_DEPLOYMENT);
    carsContract = Cars__factory.connect(deployment.address, deployer);
  });

  it('Should return 0 since no car registered', async () => {
    expect(await carsContract.getOdometerFromCar(0)).to.equal(0);
    expect(await carsContract.getOdometerFromSerialNumber("123")).to.equal(0);
    expect(await carsContract.getTokenIds()).to.equal(0);
  });

  describe('Registration process', function () {
    const HASH = 'test';
    const ODOMETER = 100;
    const SERIALNUMBER = 'ABC-123';
    let carId: BigNumber;
    beforeEach(async () => {
      await carsContract.connect(alice).register(SERIALNUMBER, ODOMETER, HASH);
      carId = await carsContract.getTokenIds();
    });

    it("Should register the car's hash", async () => {
      expect(await carsContract.tokenURI(carId)).to.equal(HASH);
    });

    it("Should register the car's odometer from car id", async () => {
      expect(await carsContract.getOdometerFromCar(carId)).to.equal(ODOMETER);
    });

    it("Should register the car's odometer from serial number", async () => {
      expect(await carsContract.getOdometerFromSerialNumber(SERIALNUMBER)).to.equal(ODOMETER);
    });

    it('Should not allow to register two cars with same serial number', async () => {
      await expect(carsContract.register(SERIALNUMBER, ODOMETER, HASH)).revertedWith(CAR_MINTED);
    });

    describe('Update odometer process', function () {
      it("Should update car's odometer", async () => {
        await carsContract.connect(alice).updateOdometer(carId, 1000);
        expect(await carsContract.getOdometerFromCar(carId)).to.equal(1000);
      });

      it('Should throw token nonexistant error', async () => {
        await expect(carsContract.connect(alice).updateOdometer(10, 1000)).revertedWith(IS_EXISTENT_TOKEN);
      });
    });
  });
});

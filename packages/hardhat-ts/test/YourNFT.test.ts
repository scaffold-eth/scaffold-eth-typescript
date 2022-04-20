import '../helpers/hardhat-imports';

import { expect } from 'chai';
import { ethers, run } from 'hardhat';

import { YourNFT } from '../generated/contract-types/YourNFT';

import './helpers/chai-imports';

//
// this script executes when you run 'yarn test'
//
// you can also test remote submissions like:
// CONTRACT_ADDRESS=0x43Ab1FCd430C1f20270C2470f857f7a006117bbb yarn test --network rinkeby
//
// you can even run mint commands if the tests pass like:
// yarn test && echo "PASSED" || echo "FAILED"
//

describe('🚩 Challenge 0: 🎟 Simple NFT Example 🤓', function () {
  this.timeout(180000);

  // console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe('YourNFT', function () {
    let yourNFTContract: YourNFT;
    beforeEach(async () => {
      const from = '0x8ba1f109551bD432803012645Ac136ddd64DBA72';
      const salt = Math.random().toString();
      const initCode = '0x6394198df16000526103ff60206004601c335afa6040516060f3';
      const initCodeHash = keccak256(initCode);

      const address = ethers.utils.getCreate2Address(from, salt, initCodeHash);
      await run('mint', { toAddress: address });

      const factory = await ethers.getContractFactory('YourNFT');
      yourNFTContract = (await factory.deploy(address)) as YourNFT;
    });

    describe('mintItem()', function () {
      it('Should be able to mint an NFT', async function () {
        const [owner] = await ethers.getSigners();

        console.log('\t', ' 🧑‍🏫 Tester Address: ', owner.address);

        const startingBalance = await yourNFTContract.balanceOf(owner.address);
        console.log('\t', ' ⚖️ Starting balance: ', startingBalance.toNumber());

        console.log('\t', ' 🔨 Minting...');
        const mintResult = await yourNFTContract.mintItem(owner.address, 'QmfVMAmNM1kDEBYrC2TPzQDoCRFH6F5tE1e9Mr4FkkR5Xr');
        console.log('\t', ' 🏷  mint tx: ', mintResult.hash);

        console.log('\t', ' ⏳ Waiting for confirmation...');
        const txResult = await mintResult.wait(2);
        expect(txResult.status).to.equal(1);

        console.log('\t', ' 🔎 Checking new balance: ', startingBalance.toNumber());
        expect(await yourNFTContract.balanceOf(owner.address)).to.equal(startingBalance.add(1));
      });

      it('Should track tokens of owner by index', async function () {
        const [owner] = await ethers.getSigners();
        const startingBalance = await yourNFTContract.balanceOf(owner.address);
        const token = await yourNFTContract.tokenOfOwnerByIndex(owner.address, startingBalance.sub(1));
        expect(token.toNumber()).to.greaterThan(0);
      });
    });
  });
});

import { YourNFT__factory, YourNFT } from 'generated/contract-types';
import { task } from 'hardhat/config';
import { create } from 'ipfs-http-client';
import { getHardhatSigners } from 'tasks/functions/accounts';
import { sleep } from 'tasks/functions/utils';

task('mint', 'Mints NFTs to the specified address')
  .addPositionalParam('toAddress', 'The address that will mint them')
  .addOptionalPositionalParam('contractAddress', 'The address of contract them')
  .setAction(async ({ toAddress, contractAddress }: { toAddress: string; contractAddress?: string }, hre) => {
    const ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });

    // // // // // // // // // // // // // // // // // //

    console.log('\n\n 🎫 Minting to ' + toAddress + '...\n');

    const { deployer } = await getHardhatSigners(hre);
    let yourNFTContract: YourNFT | undefined = undefined;

    if (contractAddress != null) {
      try {
        yourNFTContract = YourNFT__factory.connect(contractAddress, deployer);
      } catch (e) {
        console.log('Invalid contractAddress, creating new YourNFT contract');
        return;
      }
    }

    if (yourNFTContract == null) {
      const factory = new YourNFT__factory(deployer);
      yourNFTContract = await factory.deploy();
      console.log('\n\n 🎫 YourNFT contract deployed at ' + yourNFTContract.address + '\n');
    }

    if (yourNFTContract == null) {
      console.error('Could not get contract or create contract');
      return;
    }
    const delay = 1000;

    const buffalo = {
      description: "It's actually a bison?",
      external_url: 'https://austingriffith.com/portfolio/paintings/', // <-- this can link to a page for the specific file too
      image: 'https://austingriffith.com/images/paintings/buffalo.jpg',
      name: 'Buffalo',
      attributes: [
        {
          trait_type: 'BackgroundColor',
          value: 'green',
        },
        {
          trait_type: 'Eyes',
          value: 'googly',
        },
        {
          trait_type: 'Stamina',
          value: 42,
        },
      ],
    };
    console.log('Uploading buffalo...');
    const uploaded = await ipfs.add(JSON.stringify(buffalo));

    console.log('Minting buffalo with IPFS hash (' + uploaded.path + ')');
    await yourNFTContract.mintItem(toAddress, uploaded.path, {
      gasLimit: 400000,
    });

    await sleep(delay);

    const zebra = {
      description: 'What is it so worried about?',
      external_url: 'https://austingriffith.com/portfolio/paintings/', // <-- this can link to a page for the specific file too
      image: 'https://austingriffith.com/images/paintings/zebra.jpg',
      name: 'Zebra',
      attributes: [
        {
          trait_type: 'BackgroundColor',
          value: 'blue',
        },
        {
          trait_type: 'Eyes',
          value: 'googly',
        },
        {
          trait_type: 'Stamina',
          value: 38,
        },
      ],
    };
    console.log('Uploading zebra...');
    const uploadedzebra = await ipfs.add(JSON.stringify(zebra));

    console.log('Minting zebra with IPFS hash (' + uploadedzebra.path + ')');
    await yourNFTContract.mintItem(toAddress, uploadedzebra.path, {
      gasLimit: 400000,
    });

    await sleep(delay);

    const rhino = {
      description: 'What a horn!',
      external_url: 'https://austingriffith.com/portfolio/paintings/', // <-- this can link to a page for the specific file too
      image: 'https://austingriffith.com/images/paintings/rhino.jpg',
      name: 'Rhino',
      attributes: [
        {
          trait_type: 'BackgroundColor',
          value: 'pink',
        },
        {
          trait_type: 'Eyes',
          value: 'googly',
        },
        {
          trait_type: 'Stamina',
          value: 22,
        },
      ],
    };
    console.log('Uploading rhino...');
    const uploadedrhino = await ipfs.add(JSON.stringify(rhino));

    console.log('Minting rhino with IPFS hash (' + uploadedrhino.path + ')');
    await yourNFTContract.mintItem(toAddress, uploadedrhino.path, {
      gasLimit: 400000,
    });

    await sleep(delay);

    const fish = {
      description: 'Is that an underbyte?',
      external_url: 'https://austingriffith.com/portfolio/paintings/', // <-- this can link to a page for the specific file too
      image: 'https://austingriffith.com/images/paintings/fish.jpg',
      name: 'Fish',
      attributes: [
        {
          trait_type: 'BackgroundColor',
          value: 'blue',
        },
        {
          trait_type: 'Eyes',
          value: 'googly',
        },
        {
          trait_type: 'Stamina',
          value: 15,
        },
      ],
    };
    console.log('Uploading fish...');
    const uploadedfish = await ipfs.add(JSON.stringify(fish));

    console.log('Minting fish with IPFS hash (' + uploadedfish.path + ')');
    await yourNFTContract.mintItem(toAddress, uploadedfish.path, {
      gasLimit: 400000,
    });

    await sleep(delay);

    console.log('Transferring Ownership of YourCollectible to ' + toAddress + '...');

    await yourNFTContract.transferOwnership(toAddress, { gasLimit: 400000 });

    await sleep(delay);

    /*


  console.log("Minting zebra...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","zebra.jpg")

  */

    // const secondContract = await deploy("SecondContract")

    // const exampleToken = await deploy("ExampleToken")
    // const examplePriceOracle = await deploy("ExamplePriceOracle")
    // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

    /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

    /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

    /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
  });

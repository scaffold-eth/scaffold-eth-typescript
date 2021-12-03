import { YourContract } from 'generated/typechain'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { deploy } from 'helpers/deploy-helpers'

const deployFn: DeployFunction = async (hre) => {
  const { contracts, getNamedAccounts, getNamedSigner } = hre

  // Get a Signer object from a given name defined in `hardhat.config.ts`
  const deployer = await getNamedSigner('deployer')
  // Get an object of named account addresses defined in `hardhat.config.ts`
  const { deployer: deployerAddress } = await getNamedAccounts()

  // Deploy an instance of YourContract
  const deployedContract = await deploy<YourContract>({
    // Specify the name of the contract to deploy
    contract: 'YourContract',

    // // Specify a __different__ name to save the deployment instance as.
    // // You can use this value to deploy multiple instances of the same contract
    // // and save them under different names.
    // name: 'MyContract',

    // // Add args to the constructor if applicable
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],

    // // If you want to send some ETH to a contract on deploy (make your constructor payable!)
    // value: ethers.utils.parseEther('0.05'),

    // // If you want to link a library into your contract, you must specify the name
    // // of the library and the address of the deployed library
    // libraries: {
    //   ['YourLibraryName']: '0xYourLibraryAddress'
    // },

    // // If your contract has changes since your last deployment, you can set this
    // // value to `false` if you want to deploy a new instance.
    // // By default this value is `true`.
    // skipIfAlreadyDeployed: true,

    hre,
  })

  // Getting a previously deployed contract
  const yourContract = await contracts.get<YourContract>('YourContract', {
    // Specifies which Signer to use by default when signing transactions
    from: deployerAddress,

    // // If you want to instantiate a version of a contract at a specific address:
    // at: deployedContract.address,
  })

  // Call a function on your contract
  await yourContract.setPurpose('Hello')

  // To take ownership of yourContract using the ownable library uncomment next line and add the
  // address you want to be the owner.
  await yourContract
    .transferOwnership('0x1234')
    // You can wait for the transaction to be mined and return the tx receipt after a
    // certain amount of block confirmations
    .then(({ wait }) => wait(1))

  // If you want to send value to an address from the deployer
  await deployer.sendTransaction({
    to: '0x34aA3F359A9D614239015126635CE7732c18fDF3',
    value: ethers.utils.parseEther('0.001'),
  })
}
deployFn.tags = ['YourContract']

export default deployFn

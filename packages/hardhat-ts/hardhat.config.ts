/* eslint-disable @typescript-eslint/no-unsafe-argument */
// This adds support for typescript paths mappings
import 'tsconfig-paths/register'

import '@typechain/hardhat'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-ethers'
import '@tenderly/hardhat-tenderly'
import 'hardhat-deploy'
import * as fs from 'fs'

import {
  TransactionReceipt,
  TransactionRequest,
} from '@ethersproject/providers'
import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/dist/src/types'
import * as chalk from 'chalk'
import { Signer, utils } from 'ethers'
import { HardhatUserConfig, task } from 'hardhat/config'

const { isAddress, getAddress, formatUnits, parseUnits } = utils

//
// Select the network you want to deploy to here:
//
const defaultNetwork = 'localhost'

const getMnemonic = (): string => {
  try {
    return fs.readFileSync('./mnemonic.secret').toString().trim()
  } catch (e) {
    // @ts-ignore
    if (defaultNetwork !== 'localhost') {
      console.log(
        '☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.'
      )
    }
  }
  return ''
}

const config: HardhatUserConfig = {
  defaultNetwork,
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: {
    localhost: {
      url: 'http://localhost:8545',
      /*
        if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    hardhat: {
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad', // <---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: '../vite-app-ts/src/generated/contract-types',
  },
}
export default config

const DEBUG = false

const debug = (text: string): void => {
  if (DEBUG) {
    console.log(text)
  }
}

task('wallet', 'Create a wallet (pk) link', async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom()
  const privateKey = randomWallet._signingKey().privateKey
  console.log(`🔐 WALLET Generated as ${randomWallet.address}`)
  console.log(`🔗 http://localhost:3000/pk#${privateKey}`)
})

task('fundedwallet', 'Create a wallet (pk) link and fund it with deployer?')
  .addOptionalParam(
    'amount',
    'Amount of ETH to send to wallet after generating'
  )
  .addOptionalParam('url', 'URL to add pk to')
  .setAction(async (taskArgs, { ethers }) => {
    const randomWallet = ethers.Wallet.createRandom()
    console.log(`🔐 WALLET Generated as ${randomWallet.address}`)
    const url: string = taskArgs.url ? taskArgs.url : 'http://localhost:3000'

    const amount: string = taskArgs.amount ? taskArgs.amount : '0.01'
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount),
    }

    // SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    const localDeployerMnemonic = getMnemonic()
    if (localDeployerMnemonic) {
      let deployerWallet = ethers.Wallet.fromMnemonic(localDeployerMnemonic)
      deployerWallet = deployerWallet.connect(ethers.provider)
      console.log(
        `💵 Sending ${amount} ETH to ${randomWallet.address} using deployer account`
      )
      const sendResult = await deployerWallet.sendTransaction(tx)

      console.log()
      console.log(`${url}/pk#${randomWallet.privateKey}`)
      console.log()

      return sendResult
    } else {
      console.log(
        `💵 Sending ${amount} ETH to ${randomWallet.address} using local node`
      )
      console.log()
      console.log(`${url}/pk#${randomWallet.privateKey}`)
      console.log()

      return await send(ethers.provider.getSigner(), tx)
    }
  })

task(
  'generate',
  'Create a mnemonic for builder deploys',
  async (_, { ethers }) => {
    const wallet = ethers.Wallet.createRandom()
    if (DEBUG) {
      console.log('mnemonic', wallet.mnemonic.phrase)
      console.log('fullPath', wallet.mnemonic.path)
      console.log('privateKey', wallet.privateKey)
    }

    console.log(
      `🔐 Account Generated as ${wallet.address} and set as mnemonic in packages/hardhat`
    )
    console.log(
      "💬 Use 'yarn run account' to get more information about the deployment account."
    )

    fs.writeFileSync(`./${wallet.address}.secret`, wallet.mnemonic.phrase)
    fs.writeFileSync('./mnemonic.secret', wallet.mnemonic.phrase)
  }
)

task(
  'mineContractAddress',
  'Looks for a deployer account that will give leading zeros'
)
  .addOptionalParam('searchFor', 'String to search for')
  .addOptionalParam('startsWith', 'String to search for')
  .setAction(async (taskArgs, { ethers }) => {
    if (!taskArgs.searchFor && !taskArgs.startsWith) {
      console.error(chalk.red('No arguments set.'))
      return
    }

    let wallet: ReturnType<typeof ethers.Wallet.createRandom>
    let contractAddress = ''
    let attempt = 0
    let shouldRetry = true
    while (shouldRetry) {
      if (attempt > 0) {
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
      }
      attempt++
      process.stdout.write(`Mining attempt ${attempt}`)

      wallet = ethers.Wallet.createRandom()
      contractAddress = ethers.utils.getContractAddress({
        from: wallet.address,
        nonce: 0,
      })

      if (taskArgs.searchFor) {
        shouldRetry = contractAddress.indexOf(taskArgs.searchFor) != 0
      } else if (taskArgs.startsWith) {
        shouldRetry =
          !contractAddress
            .substr(2)
            .startsWith(taskArgs.startsWith.toLowerCase()) &&
          !contractAddress
            .substr(2)
            .startsWith(taskArgs.startsWith.toUpperCase())
      }
    }
    process.stdout.write('\n')

    if (DEBUG) {
      console.log('mnemonic', wallet!.mnemonic.phrase)
      console.log('fullPath', wallet!.mnemonic.path)
      console.log('privateKey', wallet!.privateKey)
    }

    console.log(
      `⛏  Account Mined as ${
        wallet!.address
      } and set as mnemonic in packages/hardhat`
    )
    console.log(
      `📜 This will create the first contract: ${chalk.magenta(
        contractAddress
      )}`
    )
    console.log(
      "💬 Use 'yarn run account' to get more information about the deployment account."
    )

    fs.writeFileSync(
      `./${wallet!.address}_produces${contractAddress}.secret`,
      wallet!.mnemonic.phrase
    )
    fs.writeFileSync('./mnemonic.secret', wallet!.mnemonic.phrase)
  })

task(
  'account',
  'Get balance information for the deployment account.',
  async (_, { ethers, config }) => {
    try {
      const mnemonic = getMnemonic()
      const wallet = ethers.Wallet.fromMnemonic(mnemonic)

      if (DEBUG) {
        console.log('mnemonic', wallet.mnemonic.phrase)
        console.log('fullPath', wallet.mnemonic.path)
        console.log('privateKey', wallet.privateKey)
      }

      const qrcode = require('qrcode-terminal')
      qrcode.generate(wallet.address)
      console.log(`‍📬 Deployer Account is ${wallet.address}`)
      for (const networkName in config.networks) {
        const network = config.networks[networkName]
        if (!('url' in network)) continue
        try {
          const provider = new ethers.providers.JsonRpcProvider(network.url)
          const balance = await provider.getBalance(wallet.address)
          console.log(` -- ${chalk.bold(networkName)} -- -- -- 📡 `)
          console.log(`  balance: ${ethers.utils.formatEther(balance)}`)
          console.log(
            `  nonce: ${await provider.getTransactionCount(wallet.address)}`
          )
          console.log()
        } catch (e) {
          if (DEBUG) {
            console.log(e)
          }
        }
      }
    } catch (err) {
      console.log(`--- Looks like there is no mnemonic file created yet.`)
      console.log(
        `--- Please run ${chalk.greenBright('yarn generate')} to create one`
      )
    }
  }
)

/**
 * Get a checksumed address.
 * @param ethers {HardhatEthersHelpers} Ethers object from Hardhat.
 * @param addr {string | number} The address string to be checksumed or an index in the account's mnemonic.
 * @return Promise<string> The checksumed address
 */
async function findFirstAddr(
  ethers: HardhatEthersHelpers,
  addr: string | number
): Promise<string> {
  if (typeof addr === 'string' && isAddress(addr)) {
    return getAddress(addr)
  } else if (typeof addr === 'number') {
    const accounts = await ethers.provider.listAccounts()
    if (accounts[addr] !== undefined) {
      return getAddress(accounts[addr])
    }
  }
  throw new Error(`Could not normalize address: ${addr}`)
}

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts()
  accounts.forEach((account) => console.log(account))
})

task('blockNumber', 'Prints the block number', async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber()
  console.log(blockNumber)
})

task('balance', "Prints an account's balance")
  .addPositionalParam(
    'account',
    "The account's address or index in the mnemonic"
  )
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await findFirstAddr(ethers, taskArgs.account)
    )
    console.log(formatUnits(balance, 'ether'), 'ETH')
  })

async function send(
  signer: Signer,
  txparams: TransactionRequest
): Promise<TransactionReceipt> {
  const response = await signer.sendTransaction(txparams)
  debug(`transactionHash: ${response.hash}`)
  const waitBlocksForReceipt = 0 // 2

  return await response.wait(waitBlocksForReceipt)
}

task('send', 'Send ETH')
  .addParam('from', 'From address or account index')
  .addOptionalParam('to', 'To address or account index')
  .addOptionalParam('amount', 'Amount to send in ether')
  .addOptionalParam('data', 'Data included in transaction')
  .addOptionalParam('gasPrice', 'Price you are willing to pay in gwei')
  .addOptionalParam('gasLimit', 'Limit of how much gas to spend')
  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await findFirstAddr(ethers, taskArgs.from)
    debug(`Normalized from address: ${from}`)
    const fromSigner = ethers.provider.getSigner(from)

    let to
    if (taskArgs.to) {
      to = await findFirstAddr(ethers, taskArgs.to)
      debug(`Normalized to address: ${to}`)
    }

    const txRequest: TransactionRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(
        taskArgs.amount ? taskArgs.amount : '0',
        'ether'
      ).toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(
        taskArgs.gasPrice ? taskArgs.gasPrice : '1.001',
        'gwei'
      ).toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    }

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      debug(`Adding data to payload: ${txRequest.data}`)
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    debug(formatUnits(txRequest.gasPrice!.toString(), 'gwei'))
    debug(JSON.stringify(txRequest, null, 2))

    return await send(fromSigner, txRequest)
  })

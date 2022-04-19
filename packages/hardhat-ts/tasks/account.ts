import { formatUnits } from '@ethersproject/units';
import { task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types';
import { generate } from 'qrcode-terminal';
import { findFirstAddr, getAccountData } from 'tasks/functions/account';
import { DEBUG } from 'tasks/helpers/debug';

import { config } from '../hardhat.config';

import { getMnemonic, mnemonicPath } from './functions/mnemonic';

task('account', 'Get balance informations for the deployment account.', async (_, hre) => {
  const { address } = await getAccountData(getMnemonic());

  generate(address);
  console.log(`‍📬 Deployer Account is ${address}`);
  for (const n in config.networks) {
    // console.log(config.networks[n],n)
    try {
      const { url } = config.networks[n] as HttpNetworkUserConfig;
      const provider = new hre.ethers.providers.JsonRpcProvider(url);
      const balance = await provider.getBalance(address);
      console.log(` -- ${n} --  -- -- 📡 `);
      console.log(`   balance: ${hre.ethers.utils.formatEther(balance)}`);
      console.log(`   nonce: ${await provider.getTransactionCount(address)}`);
    } catch (e) {
      if (DEBUG) console.log(e);
    }
  }
});

task('balance', "Prints an account's balance")
  .addPositionalParam('account', "The account's address")
  .setAction(async (taskArgs: { account: string }, { ethers }) => {
    const balance = await ethers.provider.getBalance(await findFirstAddr(ethers, taskArgs.account));
    console.log(formatUnits(balance, 'ether'), 'ETH');
  });

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account: any) => console.log(account));
});

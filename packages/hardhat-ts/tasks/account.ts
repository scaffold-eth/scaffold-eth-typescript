import { task } from 'hardhat/config';
import { HttpNetworkUserConfig } from 'hardhat/types';
import { getAccountData } from 'tasks/functions/getAccountData';

import { DEBUG, config } from '../hardhat.config';

import { getMnemonic, mnemonicPath } from './functions/mnemonic';

task('account', 'Get balance informations for the deployment account.', async (_, hre) => {
  const { address } = await getAccountData(getMnemonic());

  const qrcode = require('qrcode-terminal');
  qrcode.generate(address);
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

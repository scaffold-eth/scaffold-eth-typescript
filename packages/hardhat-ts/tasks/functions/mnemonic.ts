import fs from 'fs';

//
// Select the network you want to deploy to here:
//
export const mnemonicPath = './mnemonics/mnemonic.secret';
export const getMnemonic = (): string => {
  try {
    return fs.readFileSync(mnemonicPath).toString().trim();
  } catch (e) {
    if (process.env.HARDHAT_TARGET_NETWORK !== 'localhost') {
      console.log(e);
      console.log('☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn generate` and then `yarn account`.');
    }
  }
  return '';
};

import fs from 'fs';

import { invariant } from 'ts-invariant';

import { readChildFiles } from '~helpers/functions/fileHelper';

const mnemonicFolder = './mnemonics';
const defaultMnemonicFile = 'mnemonic.secret';

//
// Select the network you want to deploy to here:
//
export const defaultMnemonicPath = './mnemonics/mnemonic.secret';
export const getMnemonic = (path?: string): string => {
  try {
    return fs
      .readFileSync(path ?? defaultMnemonicPath)
      .toString()
      .trim();
  } catch (e) {
    console.log('☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn generate` and then `yarn account`.');
  }
  return '';
};

export const getMnemonicPath = async (address: string | undefined = undefined): Promise<string> => {
  let file: string | undefined = undefined;
  if (address == null) {
    const defaultFiles = await readChildFiles(mnemonicFolder, new RegExp(defaultMnemonicFile));
    invariant(defaultFiles?.[0] != null, 'mnemonic file not found, generate one with yarn generate');

    file = defaultFiles[0];
  } else {
    const files = await readChildFiles(mnemonicFolder, new RegExp(`^${address}\.secret$`));
    invariant(files?.[0] != null, `mnemonic file not found for address: ${address}`);

    file = files[0];
  }

  // const data = (await readFile(file[0])).toString();
  // invariant(data?.length > 40, `mnemonic file is empty or invalid for address: ${address}`);

  return file;
};

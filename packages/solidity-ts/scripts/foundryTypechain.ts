import { runTypeChain, glob } from 'typechain';

import { foundryArtifactsDir, typechainOutDir } from '~helpers/constants/folders';

export const typechainTarget = 'ethers-v5';

const typechain = async (): Promise<void> => {
  const cwd = process.cwd();
  // find all files matching the glob
  const allFiles = glob(cwd, [`${foundryArtifactsDir}/!(build-info)/**/+([a-zA-Z0-9_]).json`]);

  const result = await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: typechainOutDir,
    target: typechainTarget,
  });

  console.log(result);
};

typechain().catch(console.error);

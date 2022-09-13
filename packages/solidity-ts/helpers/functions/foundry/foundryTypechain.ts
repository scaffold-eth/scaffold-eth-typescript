import { runTypeChain, glob } from 'typechain';

import { foundryArtifactsDir, typechainOutDir } from '~helpers/constants/toolkitPaths';

export const typechainTarget = 'ethers-v5';

export const foundryTypechain = async (): Promise<void> => {
  const cwd = process.cwd();
  // find all files matching the glob
  const allFiles = glob(cwd, [`${foundryArtifactsDir}/!(build-info)/**/+([a-zA-Z0-9_]).json`]);

  const result = await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: typechainOutDir,
    target: typechainTarget,
    flags: {
      discriminateTypes: true,
      environment: undefined,
      alwaysGenerateOverloads: false,
    },
  });

  console.log(result);
};

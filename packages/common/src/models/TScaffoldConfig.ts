import { z } from 'zod';

import { solidityToolkits, NetworkNamesList, reactBuilds } from '~common/models';

export const scaffoldConfigSchema = z.object({
  build: z.object({
    solidityToolkit: z.enum(solidityToolkits),
    reactBuild: z.enum(reactBuilds),
  }),
  runtime: z.object({
    /**
     * The networks the app will be available for
     */
    availableNetworks: z.enum(NetworkNamesList).array(),
    /**
     * The target network to use for deployment, compilation
     * The target network should be part of the availableNetworks list
     */
    targetNetwork: z.enum(NetworkNamesList).default('localhost'),
    networkConfig: z
      .object({
        rpcMainnetInfuraUrl: z.string().default('https://mainnet.infura.io/v3'),
      })
      .default({}),
    buidlGuidl: z
      .object({
        rpcMainnet: z.string().default('https://rpc.scaffoldeth.io:48544'),
        infuraId: z.string().default('3ccea23c26224daf802cf31e4699d15e'),
      })
      .default({}),
  }),
});

export type TScaffoldConfig = z.infer<typeof scaffoldConfigSchema>;

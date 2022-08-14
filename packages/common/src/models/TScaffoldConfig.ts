import { z } from 'zod';

import { solidityToolkits, NetworkNamesList, reactBuilds } from '~common/models';

export const scaffoldConfigSchema = z.object({
  build: z.object({
    solidityToolkit: z.enum(solidityToolkits),
    reactBuild: z.enum(reactBuilds),
  }),
  runtime: z.object({
    targetNetworks: z.enum(NetworkNamesList).array(),
  }),
});

export type TScaffoldConfig = z.infer<typeof scaffoldConfigSchema>;

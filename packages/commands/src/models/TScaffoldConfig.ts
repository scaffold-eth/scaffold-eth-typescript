import { z } from 'zod';
import { solidityToolkits, NetworkNames } from '~common/models';
import { reactBuild } from '~common/models';

export const scaffoldConfigSchema = z.object({
  build: z.object({
    solidityToolkit: z.enum(solidityToolkits),
    reactBuild: z.enum(reactBuild),
  }),
  runtime: z.object({
    targetNetworks: z.enum(NetworkNames).array(),
  }),
});

export type TScaffoldConfig = z.infer<typeof scaffoldConfigSchema>;

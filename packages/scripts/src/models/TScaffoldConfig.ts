import { z } from 'zod';
import { EtherumToolkits, NetworkNames } from '~common/models';

export const scaffoldConfigSchema = z.object({
  ethereumToolkit: z.enum(EtherumToolkits),
  targetNetworks: z.enum(NetworkNames).array(),
});

export type TScaffoldConfig = z.infer<typeof scaffoldConfigSchema>;

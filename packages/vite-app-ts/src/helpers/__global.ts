/* eslint-disable unused-imports/no-unused-vars-ts */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as nodeBuffer from 'buffer';
import * as nodeProcess from 'process';

import 'eth-hooks/helpers/__global';

// (window as any).global = window;
// const global = window;

if (!global.hasOwnProperty('Buffer')) {
  (global as any).Buffer = nodeBuffer.Buffer;
}

(global as any).process = nodeProcess;

export {};

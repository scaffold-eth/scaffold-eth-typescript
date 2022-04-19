export const DEBUG = false;

export const debugLog = (...args: any[]): void => {
  if (DEBUG) {
    console.log(args);
  }
};

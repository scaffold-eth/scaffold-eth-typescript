export const processUnknownArgs = (args: string[] | string): string => {
  if (Array.isArray(args) && args.join != null) {
    return ' ' + args.join(' ');
  } else if (typeof args === 'string') {
    return ` ${args}`;
  }

  return '';
};

import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * modified lazy
 * @param factory
 * @param name
 * @returns
 */
export const lazier = <T extends ComponentType<any>>(
   factory: () => Promise<{
      [name: string]: T;
   }>,
   name: string
): LazyExoticComponent<T> => {
   return lazy(() => {
      return factory().then((module) => ({ default: module[name] }));
   });
};

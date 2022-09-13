import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export const readAllChildDirs = async (dirPath: string): Promise<string[]> => {
  const allChildren = await Promise.all(
    (
      await readdir(dirPath)
    ).map(async (entity) => {
      const path = join(dirPath, entity);
      return (await lstat(path)).isDirectory() ? path : null;
    })
  );

  const childDirs: string[] = allChildren.filter((f) => f !== null) as string[];
  return childDirs;
};
export const readChildFiles = async (dirPath: string, fileNameFilter: RegExp): Promise<string[]> => {
  const allChildren = await Promise.all(
    (
      await readdir(dirPath)
    ).map(async (entity) => {
      const path = join(dirPath, entity);
      return (await lstat(path)).isDirectory() ? null : path;
    })
  );

  const childDirs: string[] = allChildren.filter((f) => f !== null) as string[];
  const result = childDirs.filter((f) => fileNameFilter.test(f));
  return result;
};

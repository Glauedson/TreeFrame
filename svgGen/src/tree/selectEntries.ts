import type { TreeEntry, TreeframeConfig } from '../domain/types';
import { createPathMatcher } from './ignoreMatcher';

/** Applies ignore list, hidden paths, depth limit and the files toggle. */
export function selectEntries(entries: readonly TreeEntry[], config: TreeframeConfig): TreeEntry[] {
  const isExcluded = createPathMatcher([...config.ignore, ...config.hide]);
  return entries.filter(
    (entry) =>
      !isExcluded(entry.path) &&
      entry.path.split('/').length <= config.depth &&
      (config.showFiles || entry.type === 'dir'),
  );
}

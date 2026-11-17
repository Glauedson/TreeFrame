import type { TreeEntry, TreeNode, TreeframeConfig } from '../domain/types';
import { buildTree } from './buildTree';
import { selectEntries } from './selectEntries';
import { collapseTree, describeTree, paintTree, sortTree } from './transforms';

export interface CreateTreeOptions {
  rootName: string;
  config: TreeframeConfig;
  palette: readonly string[];
}

/** Full pipeline: raw entries -> filtered, sorted, collapsed, described, colored tree. */
export function createTree(entries: readonly TreeEntry[], { rootName, config, palette }: CreateTreeOptions): TreeNode {
  const tree = buildTree(selectEntries(entries, config), rootName);
  sortTree(tree);
  collapseTree(tree, config.maxChildren);
  describeTree(tree, config);
  return paintTree(tree, config, palette);
}

export interface OutlineItem {
  path: string;
  name: string;
  kind: TreeNode['kind'];
  depth: number;
}

/** Flat, ordered list of nodes. Used by the editor to list what can be tweaked. */
export function flattenTree(root: TreeNode): OutlineItem[] {
  return root.children.flatMap((child) => [
    { path: child.path, name: child.name, kind: child.kind, depth: child.depth },
    ...flattenTree(child),
  ]);
}

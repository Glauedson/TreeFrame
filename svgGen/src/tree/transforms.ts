import { DEFAULT_DESCRIPTIONS, SPLIT_COLOR_DIRS } from '../config/defaults';
import type { TreeNode, TreeframeConfig } from '../domain/types';
import { createNode } from './buildTree';

const isDir = (node: TreeNode) => node.kind === 'dir';

/** Directories first, then alphabetical (case-insensitive). */
export function sortTree(node: TreeNode): TreeNode {
  node.children.sort(
    (a, b) => Number(isDir(b)) - Number(isDir(a)) || a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  );
  node.children.forEach(sortTree);
  return node;
}

/** Keeps at most `limit` children per directory and adds a "+N more" leaf. */
export function collapseTree(node: TreeNode, limit: number): TreeNode {
  if (node.children.length > limit) {
    const hidden = node.children.length - limit;
    node.children = [
      ...node.children.slice(0, limit),
      createNode(`… +${hidden} more`, `${node.path}/…`, 'more', node.depth + 1),
    ];
  }
  node.children.forEach((child) => collapseTree(child, limit));
  return node;
}

export function describeTree(node: TreeNode, config: TreeframeConfig): TreeNode {
  const fallback = config.useDefaultDescriptions ? DEFAULT_DESCRIPTIONS[node.name] : undefined;
  if (node.depth > 0 && node.kind !== 'more') {
    node.description = config.descriptions[node.path] ?? fallback;
  }
  node.children.forEach((child) => describeTree(child, config));
  return node;
}

/**
 * Each top-level branch takes the next palette color and passes it down.
 * Children of split directories (e.g. `src/`) take their own color instead.
 */
export function paintTree(root: TreeNode, config: TreeframeConfig, palette: readonly string[]): TreeNode {
  let next = 0;
  const nextColor = () => palette[next++ % palette.length] as string;

  const paint = (node: TreeNode, parent: TreeNode, inherited: string | undefined) => {
    const startsBranch =
      parent.depth === 0 || (parent.depth === 1 && SPLIT_COLOR_DIRS.includes(parent.name));
    const base = startsBranch ? nextColor() : inherited;
    node.color = config.colors[node.path] ?? base;
    node.children.forEach((child) => paint(child, node, node.color));
  };

  root.children.forEach((child) => paint(child, root, undefined));
  return root;
}

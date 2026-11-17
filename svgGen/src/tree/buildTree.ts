import type { NodeKind, TreeEntry, TreeNode } from '../domain/types';

export const createNode = (name: string, path: string, kind: NodeKind, depth: number): TreeNode => ({
  name, path, kind, depth, children: [],
});

/** Turns a flat list of paths into a nested tree rooted at `rootName`. */
export function buildTree(entries: readonly TreeEntry[], rootName: string): TreeNode {
  const root = createNode(rootName, '', 'dir', 0);
  const index = new Map<string, TreeNode>([['', root]]);

  for (const entry of entries) {
    const segments = entry.path.split('/');
    segments.forEach((name, i) => {
      const path = segments.slice(0, i + 1).join('/');
      if (index.has(path)) return;
      const isLeaf = i === segments.length - 1;
      const node = createNode(name, path, isLeaf ? entry.type : 'dir', i + 1);
      index.get(segments.slice(0, i).join('/'))?.children.push(node);
      index.set(path, node);
    });
  }
  return root;
}

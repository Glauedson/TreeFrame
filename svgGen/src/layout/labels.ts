import type { TreeNode } from '../domain/types';

export const labelOf = (node: TreeNode): string => (node.kind === 'dir' ? `${node.name}/` : node.name);
export const commentOf = (description: string): string => `# ${description}`;

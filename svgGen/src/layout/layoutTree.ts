import type { TreeNode } from '../domain/types';
import { commentOf, labelOf } from './labels';
import { METRICS, textXAt } from './metrics';

export interface LayoutNode {
  node: TreeNode;
  /** Position in reading order, root is 0. */
  index: number;
  top: number;
  centerY: number;
  children: LayoutNode[];
}

export interface Layout {
  root: LayoutNode;
  rowCount: number;
  width: number;
  height: number;
  commentX: number;
  showComments: boolean;
}

/** Assigns a row to every node (depth-first) and measures the canvas. */
export function layoutTree(root: TreeNode, showComments: boolean): Layout {
  let rowCount = 0;
  let textEnd = 0;
  let commentChars = 0;

  const place = (node: TreeNode): LayoutNode => {
    const index = rowCount++;
    const top = METRICS.padTop + index * METRICS.rowHeight;
    textEnd = Math.max(textEnd, textXAt(node.depth) + labelOf(node).length * METRICS.charWidth);
    if (showComments && node.description) {
      commentChars = Math.max(commentChars, commentOf(node.description).length);
    }
    return { node, index, top, centerY: top + METRICS.rowHeight / 2, children: node.children.map((c) => place(c)) };
  };

  const placed = place(root);
  const commentX = Math.max(METRICS.minCommentX, Math.ceil((textEnd + METRICS.commentGap) / 10) * 10);
  const contentEnd = commentChars ? commentX + commentChars * METRICS.charWidth : textEnd;

  return {
    root: placed,
    rowCount,
    commentX,
    showComments,
    width: Math.max(METRICS.minWidth, Math.ceil(contentEnd + METRICS.sidePadding)),
    height: METRICS.padTop + rowCount * METRICS.rowHeight + METRICS.padBottom,
  };
}

import type { Theme } from '../domain/types';
import { commentOf, labelOf } from '../layout/labels';
import type { Layout, LayoutNode } from '../layout/layoutTree';
import { METRICS, iconXAt, textXAt } from '../layout/metrics';
import { highlightPath } from './connectors';
import { escapeXml } from './escapeXml';
import { renderIcon } from './icons';

export interface RenderContext {
  theme: Theme;
  layout: Layout;
}

function renderRow({ theme, layout }: RenderContext, { node, top }: LayoutNode): string {
  const isRoot = node.depth === 0;
  const textY = top + METRICS.textBaseline;
  const comment =
    layout.showComments && node.description
      ? `<text class="cm" x="${layout.commentX}" y="${textY}">${escapeXml(commentOf(node.description))}</text>`
      : '';

  return (
    `<g class="row"><rect class="hit" x="0" y="${top}" width="${layout.width}" height="${METRICS.rowHeight}"/>` +
    renderIcon(node.kind, iconXAt(node.depth), top) +
    `<text class="nm${isRoot ? ' rt' : ''}" x="${textXAt(node.depth)}" y="${textY}"${isRoot ? ` fill="${theme.root}"` : ''}>` +
    `${escapeXml(labelOf(node))}</text>${comment}</g>`
  );
}

/** Nested groups mirror the tree, so hovering a node also lights its ancestors. */
export function renderNode(ctx: RenderContext, layoutNode: LayoutNode, trail: readonly LayoutNode[] = []): string {
  const { node, index } = layoutNode;
  const isRoot = node.depth === 0;
  const delay = ((index - 1) * METRICS.autoplayStep).toFixed(1);

  const highlight = isRoot
    ? ''
    : `<path class="hl" style="animation-delay:${delay}s" d="${highlightPath(ctx.layout.root, trail)}"/>`;
  const children = layoutNode.children
    .map((child) => renderNode(ctx, child, [...trail, child]))
    .join('');

  return `<g class="n" style="--c:${node.color ?? ctx.theme.root}">${highlight}${renderRow(ctx, layoutNode)}${children}</g>`;
}

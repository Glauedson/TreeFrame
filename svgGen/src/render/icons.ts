import type { NodeKind } from '../domain/types';

const ICON_PATHS: Record<Exclude<NodeKind, 'more'>, (x: number, top: number) => string> = {
  dir: (x, top) => `M${x} ${top + 10}h5l2 2h7v9h-14z`,
  file: (x, top) => `M${x + 1} ${top + 8}h8l4 4v10h-12z`,
};

export function renderIcon(kind: NodeKind, x: number, top: number): string {
  return kind === 'more' ? '' : `<path class="ic" d="${ICON_PATHS[kind](x, top)}"/>`;
}

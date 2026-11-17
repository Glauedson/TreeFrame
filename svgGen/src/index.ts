import type { GeneratedSvg, TreeEntry, TreeframeConfig } from './domain/types';
import { layoutTree } from './layout/layoutTree';
import { renderSvg } from './render/renderSvg';
import { getTheme } from './theme/themes';
import { createTree } from './tree/createTree';

export interface GenerateOptions {
  repoName: string;
  config: TreeframeConfig;
}

/** Entries + resolved config in, self-contained animated SVG out. */
export function generateTreeframe(entries: readonly TreeEntry[], { repoName, config }: GenerateOptions): GeneratedSvg {
  const theme = getTheme(config.theme);
  const tree = createTree(entries, { rootName: config.title ?? repoName, config, palette: theme.palette });
  return renderSvg(layoutTree(tree, config.showComments), theme);
}

export { resolveConfig } from './config/resolveConfig';
export { createTree, flattenTree } from './tree/createTree';
export type { OutlineItem } from './tree/createTree';
export { LIMITS } from './config/defaults';
export type { GeneratedSvg, NodeKind, ThemeName, TreeEntry, TreeframeConfig } from './domain/types';

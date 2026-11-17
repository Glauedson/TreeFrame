import type { GeneratedSvg, Theme } from '../domain/types';
import type { Layout } from '../layout/layoutTree';
import { baseLinesPath } from './connectors';
import { escapeXml } from './escapeXml';
import { renderNode } from './renderNode';
import { buildStyles } from './styles';

const WINDOW_DOTS = [
  { cx: 22, color: '#ff5f57' },
  { cx: 40, color: '#febc2e' },
  { cx: 58, color: '#28c840' },
];

const GLOW_FILTER =
  '<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" result="b"/>' +
  '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

const renderWindowChrome = ({ width, height }: Layout, theme: Theme) =>
  `<rect width="${width}" height="${height}" rx="14" fill="${theme.background}"/>` +
  `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="14" fill="none" stroke="${theme.border}"/>` +
  WINDOW_DOTS.map((d) => `<circle cx="${d.cx}" cy="20" r="5" fill="${d.color}"/>`).join('');

export function renderSvg(layout: Layout, theme: Theme): GeneratedSvg {
  const { width, height, root, rowCount } = layout;
  const title = `${root.node.name}/ folder map`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">` +
    `<title>${escapeXml(title)}</title><style>${buildStyles(theme, rowCount - 1)}</style>` +
    `<defs>${GLOW_FILTER}</defs>` +
    renderWindowChrome(layout, theme) +
    `<path class="base" d="${baseLinesPath(root)}"/>` +
    renderNode({ theme, layout }, root) +
    '</svg>';

  return { svg, width, height };
}

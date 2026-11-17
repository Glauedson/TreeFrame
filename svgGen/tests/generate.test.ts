import { describe, expect, it } from 'vitest';
import { flattenTree, generateTreeframe, resolveConfig, createTree } from '../src';
import type { TreeEntry } from '../src';

const dir = (path: string): TreeEntry => ({ path, type: 'dir' });
const file = (path: string): TreeEntry => ({ path, type: 'file' });

const ENTRIES = [
  dir('public'), file('public/robots.txt'), dir('src'), dir('src/api'), dir('src/api/APOD'),
  dir('node_modules'), file('node_modules/x.js'), file('yarn.lock'),
];

describe('resolveConfig', () => {
  it('drops invalid values and keeps defaults', () => {
    const config = resolveConfig({ depth: 99, theme: 'neon', colors: { a: 'red', b: '#fff' } });
    expect(config.depth).toBe(6);
    expect(config.theme).toBe('dark');
    expect(config.colors).toEqual({ b: '#fff' });
  });
});

describe('generateTreeframe', () => {
  const config = resolveConfig();

  it('ignores noise and renders nested folders', () => {
    const { svg } = generateTreeframe(ENTRIES, { repoName: 'demo', config });
    expect(svg).toContain('demo/');
    expect(svg).toContain('APOD/');
    expect(svg).not.toContain('node_modules');
    expect(svg).not.toContain('yarn.lock');
  });

  it('escapes untrusted text', () => {
    const evil = resolveConfig({ descriptions: { src: '<script>alert(1)</script>' } });
    const { svg } = generateTreeframe(ENTRIES, { repoName: 'demo', config: evil });
    expect(svg).not.toContain('<script>');
  });

  it('limits depth', () => {
    const shallow = resolveConfig({ depth: 1 });
    expect(generateTreeframe(ENTRIES, { repoName: 'demo', config: shallow }).svg).not.toContain('APOD');
  });
});

describe('flattenTree', () => {
  it('lists nodes in reading order', () => {
    const config = resolveConfig();
    const tree = createTree(ENTRIES, { rootName: 'demo', config, palette: ['#fff'] });
    expect(flattenTree(tree).map((n) => n.path)).toEqual([
      'public', 'public/robots.txt', 'src', 'src/api', 'src/api/APOD',
    ]);
  });
});

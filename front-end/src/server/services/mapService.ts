import {
  createTree, flattenTree, generateTreeframe, resolveConfig,
  type GeneratedSvg, type OutlineItem, type TreeEntry,
} from '@treeframe/svg-gen';
import { fetchRepoConfig, fetchRepoEntries } from '../github/githubClient';
import type { RepoRef } from '@/lib/repoRef';

interface RenderRequest {
  ref: RepoRef;
  /** Overrides such as query-string options or editor state (highest priority). */
  overrides?: unknown;
  /** When false, `.treeframe.json` from the repo is ignored (live editor preview). */
  useRepoConfig?: boolean;
}

export async function renderRepoMap({ ref, overrides, useRepoConfig = true }: RenderRequest): Promise<GeneratedSvg> {
  const [entries, repoConfig] = await Promise.all([
    fetchRepoEntries(ref),
    useRepoConfig ? fetchRepoConfig(ref) : null,
  ]);
  const config = resolveConfig(repoConfig, overrides);
  return generateTreeframe(entries, { repoName: ref.repo, config });
}

export interface RepoOutline {
  /** The config currently stored in the repo, if any. */
  config: unknown | null;
  items: OutlineItem[];
}

const OUTLINE_DEPTH = 4;

/** Everything the editor needs to list folders (only default noise is ignored). */
export async function loadRepoOutline(ref: RepoRef): Promise<RepoOutline> {
  const [entries, config]: [TreeEntry[], unknown | null] = await Promise.all([
    fetchRepoEntries(ref),
    fetchRepoConfig(ref),
  ]);
  const base = resolveConfig({ depth: OUTLINE_DEPTH, maxChildren: 40 });
  const tree = createTree(entries, { rootName: ref.repo, config: base, palette: [] });
  return { config, items: flattenTree(tree) };
}

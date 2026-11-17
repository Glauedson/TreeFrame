import type { TreeEntry } from '@treeframe/svg-gen';
import { rateLimited, repoNotFound } from '../errors';
import type { RepoRef } from '@/lib/repoRef';

const API_URL = 'https://api.github.com';
const RAW_URL = 'https://raw.githubusercontent.com';
export const CONFIG_FILE = '.treeframe.json';
const REVALIDATE_SECONDS = 3600;

interface GithubTreeResponse {
  tree: { path: string; type: 'blob' | 'tree' | 'commit' }[];
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'treeframe',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const cached = { next: { revalidate: REVALIDATE_SECONDS } } as const;

/** Whole repository tree in one request (`git/trees?recursive=1`). */
export async function fetchRepoEntries({ owner, repo, branch }: RepoRef): Promise<TreeEntry[]> {
  const response = await fetch(`${API_URL}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
    headers: authHeaders(),
    ...cached,
  });
  if (response.status === 404) throw repoNotFound();
  if (response.status === 403 || response.status === 429) throw rateLimited();
  if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);

  const { tree } = (await response.json()) as GithubTreeResponse;
  return tree.flatMap(({ path, type }): TreeEntry[] =>
    type === 'tree' ? [{ path, type: 'dir' }] : type === 'blob' ? [{ path, type: 'file' }] : [],
  );
}

/** Reads `.treeframe.json` from the repo root. Returns null when absent or invalid. */
export async function fetchRepoConfig({ owner, repo, branch }: RepoRef): Promise<unknown | null> {
  const response = await fetch(`${RAW_URL}/${owner}/${repo}/${branch}/${CONFIG_FILE}`, cached);
  if (!response.ok) return null;
  return response.json().catch(() => null);
}

/** Star count of a repository, or null when GitHub cannot be reached. */
export async function fetchStarCount({ owner, repo }: Pick<RepoRef, 'owner' | 'repo'>): Promise<number | null> {
  const response = await fetch(`${API_URL}/repos/${owner}/${repo}`, { headers: authHeaders(), ...cached });
  if (!response.ok) return null;
  const data = (await response.json()) as { stargazers_count?: number };
  return data.stargazers_count ?? null;
}
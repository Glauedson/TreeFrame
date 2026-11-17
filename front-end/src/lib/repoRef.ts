export interface RepoRef {
  owner: string;
  repo: string;
  /** Branch, tag or `HEAD` (the default branch). */
  branch: string;
}

const SEGMENT = /^[\w.-]+$/;

/** Accepts `owner/repo` or any github.com URL pointing at a repository. */
export function parseRepoRef(input: string | null | undefined, branch = 'HEAD'): RepoRef | null {
  const cleaned = (input ?? '')
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
    .replace(/\.git$/i, '');
  const [owner, repo] = cleaned.split('/');
  if (!owner || !repo || !SEGMENT.test(owner) || !SEGMENT.test(repo)) return null;
  return { owner, repo, branch: SEGMENT.test(branch) ? branch : 'HEAD' };
}

export const formatRepo = ({ owner, repo }: RepoRef) => `${owner}/${repo}`;

import { PROJECT, REPO_URL, SPONSOR_URL } from '@/lib/project';
import { fetchStarCount } from '@/server/github/githubClient';
import { GithubIcon, HeartIcon, StarIcon } from './icons';

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;

export async function HeroActions() {
  const stars = await fetchStarCount(PROJECT).catch(() => null);

  return (
    <nav className="hero-actions" aria-label="Project links">
      <a className="gh-btn gh-btn--sponsor" href={SPONSOR_URL} {...EXTERNAL}>
        <HeartIcon /> Sponsor
      </a>
      <a className="gh-btn" href={REPO_URL} {...EXTERNAL}>
        <GithubIcon /> View on GitHub
      </a>
      <a className="gh-btn gh-btn--split" href={REPO_URL} {...EXTERNAL}>
        <span className="gh-btn__label"><StarIcon /> Star</span>
        {stars !== null && <span className="gh-btn__count">{stars.toLocaleString('en-US')}</span>}
      </a>
    </nav>
  );
}
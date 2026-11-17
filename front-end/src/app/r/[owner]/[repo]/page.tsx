import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyButton } from '@/components/CopyButton';
import { buildReadmeSnippet } from '@/lib/readmeSnippet';
import { formatRepo, parseRepoRef } from '@/lib/repoRef';
import { AppError } from '@/server/errors';
import { getSiteUrl } from '@/server/http/siteUrl';
import { renderRepoMap } from '@/server/services/mapService';

type Params = Promise<{ owner: string; repo: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { owner, repo } = await params;
  return { title: `${owner}/${repo} · Treeframe` };
}

export default async function RepoMapPage({ params }: { params: Params }) {
  const { owner, repo } = await params;
  const ref = parseRepoRef(`${owner}/${repo}`);
  if (!ref) notFound();
  const name = formatRepo(ref);

  const result = await renderRepoMap({ ref }).catch((error: unknown) => {
    if (error instanceof AppError && error.status === 404) notFound();
    return error instanceof AppError ? error : new AppError('Could not build this map.', 500);
  });
  if (result instanceof AppError) {
    return <main className="page"><p className="notice notice--error" role="alert">{result.message}</p></main>;
  }

  const snippet = buildReadmeSnippet(await getSiteUrl(), name);

  return (
    <main className="page">
      <header className="hero hero--row">
        <h1><a href={`https://github.com/${name}`}>{name}</a></h1>
        <Link className="btn" href={`/?repo=${name}`}>Customize</Link>
      </header>

      {/* <object> keeps hover interactive and isolates the SVG's CSS from the page. */}
      <object
        className="preview"
        type="image/svg+xml"
        data={`/api/map?repo=${name}`}
        aria-label={`Folder map of ${name}`}
        style={{ aspectRatio: `${result.width} / ${result.height}` }}
      />

      <section className="export">
        <h3>Add it to your README</h3>
        <pre>{snippet}</pre>
        <CopyButton text={snippet} label="Copy Markdown" />
      </section>
    </main>
  );
}

import { Editor } from '@/features/editor/Editor';
import { HeroActions } from '@/features/hero/HeroActions';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const { repo } = await searchParams;

  return (
    <main className="page">
      <header className="hero hero--center">
        <h1>Treeframe</h1>
        <HeroActions />
        <p>Paste a repository. Get a folder map you can drop into any README.</p>
      </header>
      <Editor initialRepo={repo} />
    </main>
  );
}
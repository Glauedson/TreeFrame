import { Editor } from '@/features/editor/Editor';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ repo?: string }> }) {
  const { repo } = await searchParams;

  return (
    <main className="page">
      <header className="hero">
        <h1>Treeframe</h1>
        <p>Paste a repository. Get a folder map you can drop into any README.</p>
      </header>
      <Editor initialRepo={repo} />
    </main>
  );
}

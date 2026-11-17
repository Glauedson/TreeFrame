import type { OutlineItem } from '@treeframe/svg-gen';
import { useCallback, useState } from 'react';
import { requestJson } from '@/lib/api';

interface OutlineResponse {
  config: unknown | null;
  items: OutlineItem[];
}

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; repo: string; items: OutlineItem[]; storedConfig: unknown | null };

export function useRepoOutline() {
  const [state, setState] = useState<State>({ status: 'idle' });

  const load = useCallback(async (repo: string): Promise<OutlineResponse | null> => {
    setState({ status: 'loading' });
    try {
      const data = await requestJson<OutlineResponse>(`/api/tree?repo=${encodeURIComponent(repo)}`);
      setState({ status: 'ready', repo, items: data.items, storedConfig: data.config });
      return data;
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : 'Could not load repository.' });
      return null;
    }
  }, []);

  return { state, load };
}

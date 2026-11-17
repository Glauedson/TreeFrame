import { useEffect, useState } from 'react';
import type { GeneratedSvg } from '@treeframe/svg-gen';
import { requestJson } from '@/lib/api';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import type { EditorConfig, Preview } from './types';

const DEBOUNCE_MS = 300;

/** Re-renders the map on the server whenever the (debounced) config changes. */
export function useSvgPreview(repo: string | null, config: EditorConfig) {
  const debouncedConfig = useDebouncedValue(config, DEBOUNCE_MS);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repo) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;

    requestJson<GeneratedSvg>('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo, config: debouncedConfig }),
      signal: controller.signal,
    })
      .then(({ svg, width, height }) => {
        objectUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
        setPreview({ url: objectUrl, width, height });
        setError(null);
      })
      .catch((e: unknown) => {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Preview failed.');
      });

    return () => {
      controller.abort();
      // The previous URL is released once the next preview replaces it.
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl as string), 1000);
    };
  }, [repo, debouncedConfig]);

  return { preview, error };
}

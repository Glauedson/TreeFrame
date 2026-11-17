'use client';

import { useCallback, useEffect, useState } from 'react';
import { parseRepoRef, formatRepo } from '@/lib/repoRef';
import { initialEditorConfig } from './configFile';
import { ExportPanel } from './ExportPanel';
import { FolderList } from './FolderList';
import { PreviewPane } from './PreviewPane';
import { RepoForm } from './RepoForm';
import { SettingsPanel } from './SettingsPanel';
import type { EditorConfig } from './types';
import { useRepoOutline } from './useRepoOutline';
import { useSvgPreview } from './useSvgPreview';

export function Editor({ initialRepo = '' }: { initialRepo?: string }) {
  const { state, load } = useRepoOutline();
  const [config, setConfig] = useState<EditorConfig>(() => initialEditorConfig(null));
  const activeRepo = state.status === 'ready' ? state.repo : null;
  const { preview, error } = useSvgPreview(activeRepo, config);

  const patchConfig = useCallback((patch: Partial<EditorConfig>) => setConfig((prev) => ({ ...prev, ...patch })), []);

  const openRepo = useCallback(
    async (input: string) => {
      const ref = parseRepoRef(input);
      const data = ref ? await load(formatRepo(ref)) : null;
      if (data) setConfig(initialEditorConfig(data.config));
    },
    [load],
  );

  useEffect(() => {
    if (initialRepo) void openRepo(initialRepo);
  }, [initialRepo, openRepo]);

  return (
    <div className="editor">
      <div className="editor__controls">
        <RepoForm initialValue={initialRepo} loading={state.status === 'loading'} onSubmit={openRepo} />
        {state.status === 'error' && <p className="notice notice--error" role="alert">{state.message}</p>}
        {state.status === 'ready' && (
          <>
            <SettingsPanel config={config} onChange={patchConfig} />
            <FolderList items={state.items} config={config} onChange={patchConfig} />
          </>
        )}
      </div>

      <div className="editor__output">
        <PreviewPane preview={preview} error={error} />
        {state.status === 'ready' && <ExportPanel repo={state.repo} config={config} />}
      </div>
    </div>
  );
}

'use client';

import { CopyButton } from '@/components/CopyButton';
import { buildReadmeSnippet } from '@/lib/readmeSnippet';
import { CONFIG_FILE_NAME, toConfigFile } from './configFile';
import type { EditorConfig } from './types';

interface Props {
  repo: string;
  config: EditorConfig;
}

function downloadConfig(content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: CONFIG_FILE_NAME });
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportPanel({ repo, config }: Props) {
  const file = toConfigFile(config);
  const snippet = buildReadmeSnippet(window.location.origin, repo);

  return (
    <section className="export">
      <h3>1. Commit this file to the repo root</h3>
      <pre>{file}</pre>
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={() => downloadConfig(file)}>
          Download {CONFIG_FILE_NAME}
        </button>
        <CopyButton text={file} label="Copy JSON" />
      </div>

      <h3>2. Paste this in your README</h3>
      <pre>{snippet}</pre>
      <CopyButton text={snippet} label="Copy Markdown" />
    </section>
  );
}

import { resolveConfig } from '@treeframe/svg-gen';
import type { EditorConfig } from './types';

export const CONFIG_FILE_NAME = '.treeframe.json';

/** Starting point of the editor: whatever the repo already declares, else defaults. */
export function initialEditorConfig(stored: unknown): EditorConfig {
  const { depth, theme, showFiles, showComments, hide, descriptions, colors } = resolveConfig(stored);
  return { depth, theme, showFiles, showComments, hide, descriptions, colors };
}

const isEmpty = (value: unknown) =>
  Array.isArray(value) ? value.length === 0 : typeof value === 'object' && value !== null && Object.keys(value).length === 0;

/** Serializes the config without empty sections, ready to commit to the repo root. */
export function toConfigFile(config: EditorConfig): string {
  const entries = Object.entries(config).filter(([, value]) => !isEmpty(value));
  return `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`;
}

/** Updates a record entry; blank values remove the key. */
export function setEntry(record: Record<string, string>, key: string, value: string): Record<string, string> {
  const { [key]: _removed, ...rest } = record;
  return value ? { ...rest, [key]: value } : rest;
}

export const isHiddenBy = (hide: readonly string[], path: string) =>
  hide.some((hidden) => path === hidden || path.startsWith(`${hidden}/`));

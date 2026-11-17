import { LIMITS, type ThemeName } from '@treeframe/svg-gen';
import type { EditorConfig } from './types';

interface Props {
  config: EditorConfig;
  onChange: (patch: Partial<EditorConfig>) => void;
}

const TOGGLES = [
  { key: 'showFiles', label: 'Show files' },
  { key: 'showComments', label: 'Show descriptions' },
] as const;

export function SettingsPanel({ config, onChange }: Props) {
  return (
    <fieldset className="settings">
      <legend>Appearance</legend>
      <label className="field">
        Depth
        <input
          type="number"
          min={LIMITS.depth.min}
          max={LIMITS.depth.max}
          value={config.depth}
          onChange={(event) => onChange({ depth: Number(event.target.value) })}
        />
      </label>
      <label className="field">
        Theme
        <select value={config.theme} onChange={(event) => onChange({ theme: event.target.value as ThemeName })}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      {TOGGLES.map(({ key, label }) => (
        <label key={key} className="check">
          <input type="checkbox" checked={config[key]} onChange={(event) => onChange({ [key]: event.target.checked })} />
          {label}
        </label>
      ))}
    </fieldset>
  );
}

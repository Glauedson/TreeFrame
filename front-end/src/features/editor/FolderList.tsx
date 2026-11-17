import type { OutlineItem } from '@treeframe/svg-gen';
import { isHiddenBy, setEntry } from './configFile';
import type { EditorConfig } from './types';

interface Props {
  items: OutlineItem[];
  config: EditorConfig;
  onChange: (patch: Partial<EditorConfig>) => void;
}

const INDENT_PX = 16;

export function FolderList({ items, config, onChange }: Props) {
  const toggleHidden = (path: string, visible: boolean) =>
    onChange({ hide: visible ? config.hide.filter((p) => p !== path) : [...config.hide, path] });

  return (
    <ul className="folders">
      {items
        .filter((item) => item.depth <= config.depth && (config.showFiles || item.kind !== 'file'))
        .map((item) => {
          const dimmed = isHiddenBy(config.hide, item.path);
          return (
            <li key={item.path} className={dimmed ? 'folders__row is-hidden' : 'folders__row'}>
              <label className="folders__name" style={{ paddingLeft: (item.depth - 1) * INDENT_PX }}>
                <input
                  type="checkbox"
                  checked={!config.hide.includes(item.path)}
                  disabled={dimmed && !config.hide.includes(item.path)}
                  onChange={(event) => toggleHidden(item.path, event.target.checked)}
                  aria-label={`Show ${item.name}`}
                />
                {item.kind === 'dir' ? `${item.name}/` : item.name}
              </label>
              <input
                className="folders__note"
                placeholder="Description"
                maxLength={80}
                value={config.descriptions[item.path] ?? ''}
                onChange={(event) => onChange({ descriptions: setEntry(config.descriptions, item.path, event.target.value) })}
              />
              <input
                type="color"
                aria-label={`Color for ${item.name}`}
                value={config.colors[item.path] ?? '#3df5ff'}
                onChange={(event) => onChange({ colors: setEntry(config.colors, item.path, event.target.value) })}
              />
            </li>
          );
        })}
    </ul>
  );
}

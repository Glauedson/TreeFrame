import type { ThemeName, TreeframeConfig } from '../domain/types';
import { DEFAULT_CONFIG, DEFAULT_IGNORE, LIMITS } from './defaults';
import {
  isHexColor, isRecord, pickBoolean, pickEnum, pickInteger,
  pickRecord, pickString, pickStringList,
} from './sanitize';

const THEMES: readonly ThemeName[] = ['dark', 'light'];

function sanitizeLayer(layer: unknown): Partial<TreeframeConfig> {
  if (!isRecord(layer)) return {};
  const clean: Partial<TreeframeConfig> = {
    title: pickString(layer.title, 60),
    depth: pickInteger(layer.depth, LIMITS.depth.min, LIMITS.depth.max),
    maxChildren: pickInteger(layer.maxChildren, LIMITS.maxChildren.min, LIMITS.maxChildren.max),
    theme: pickEnum(layer.theme, THEMES),
    showFiles: pickBoolean(layer.showFiles),
    showComments: pickBoolean(layer.showComments),
    useDefaultDescriptions: pickBoolean(layer.useDefaultDescriptions),
    ignore: pickStringList(layer.ignore),
    hide: pickStringList(layer.hide),
    descriptions: pickRecord(layer.descriptions, (v) => pickString(v, LIMITS.descriptionLength)),
    colors: pickRecord(layer.colors, (v) => (isHexColor(v) ? v : undefined)),
  };
  return Object.fromEntries(Object.entries(clean).filter(([, v]) => v !== undefined));
}

/**
 * Merges config layers (later wins): defaults < repo file < request overrides.
 * `ignore`/`hide` accumulate; records are merged key by key.
 */
export function resolveConfig(...layers: unknown[]): TreeframeConfig {
  return layers.map(sanitizeLayer).reduce<TreeframeConfig>(
    (acc, layer) => ({
      ...acc,
      ...layer,
      ignore: [...acc.ignore, ...(layer.ignore ?? [])],
      hide: [...acc.hide, ...(layer.hide ?? [])],
      descriptions: { ...acc.descriptions, ...layer.descriptions },
      colors: { ...acc.colors, ...layer.colors },
    }),
    { ...DEFAULT_CONFIG, ignore: [...DEFAULT_IGNORE] },
  );
}

// Config files come from arbitrary repositories: every field is untrusted.
export type Raw = Record<string, unknown>;

export const isRecord = (value: unknown): value is Raw =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && HEX_COLOR.test(value);

export const pickBoolean = (value: unknown): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined;

export const pickString = (value: unknown, maxLength: number): string | undefined =>
  typeof value === 'string' && value.trim()
    ? value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : undefined;

export const pickInteger = (value: unknown, min: number, max: number): number | undefined =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : undefined;

export const pickEnum = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined =>
  allowed.find((item) => item === value);

export const pickStringList = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string' && v.length > 0)
    : undefined;

export function pickRecord<T>(
  value: unknown,
  accept: (item: unknown) => T | undefined,
): Record<string, T> | undefined {
  if (!isRecord(value)) return undefined;
  const entries = Object.entries(value).flatMap(([key, item]) => {
    const accepted = accept(item);
    return accepted === undefined ? [] : [[key, accepted] as const];
  });
  return Object.fromEntries(entries);
}

/**
 * Supported patterns:
 *  - `name`       any path segment equal to name
 *  - `*suffix`    any segment ending with suffix
 *  - `a/b`        the path `a/b` and everything below it
 */
export function createPathMatcher(patterns: readonly string[]): (path: string) => boolean {
  const matchers = patterns.map(toMatcher);
  return (path) => matchers.some((matches) => matches(path));
}

function toMatcher(pattern: string): (path: string) => boolean {
  if (pattern.includes('/')) {
    const prefix = pattern.replace(/\/+$/, '');
    return (path) => path === prefix || path.startsWith(`${prefix}/`);
  }
  if (pattern.startsWith('*')) {
    const suffix = pattern.slice(1);
    return (path) => path.split('/').some((segment) => segment.endsWith(suffix));
  }
  return (path) => path.split('/').includes(pattern);
}

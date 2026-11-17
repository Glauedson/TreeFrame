/** Translates `?depth=2&theme=light&files=0` into config overrides. */
export function optionsFromSearchParams(params: URLSearchParams): Record<string, unknown> {
  const flag = (key: string) => (params.has(key) ? !['0', 'false'].includes(params.get(key) ?? '') : undefined);
  const depth = params.get('depth');

  return {
    depth: depth === null ? undefined : Number(depth),
    theme: params.get('theme') ?? undefined,
    title: params.get('title') ?? undefined,
    showFiles: flag('files'),
    showComments: flag('comments'),
  };
}

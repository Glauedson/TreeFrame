import type { Preview } from './types';

interface Props {
  preview: Preview | null;
  error: string | null;
}

export function PreviewPane({ preview, error }: Props) {
  if (error) return <p className="notice notice--error" role="alert">{error}</p>;
  if (!preview) return <p className="notice">Your map appears here as soon as a repository is loaded.</p>;

  // <object> keeps the SVG interactive (hover) and isolates its CSS from the page.
  return (
    <object
      className="preview"
      type="image/svg+xml"
      data={preview.url}
      aria-label="Folder map preview"
      style={{ aspectRatio: `${preview.width} / ${preview.height}` }}
    />
  );
}

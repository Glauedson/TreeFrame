/** Every pixel value used by layout and rendering lives here. */
export const METRICS = {
  rowHeight: 30,
  indent: 34,
  padTop: 41,
  padBottom: 45,
  baseX: 40,
  textX: 56,
  iconX: 34,
  elbow: 24,
  rootDrop: 8,
  branchDrop: 10,
  textBaseline: 19,
  charWidth: 8.4,
  minWidth: 900,
  minCommentX: 430,
  commentGap: 40,
  sidePadding: 40,
  autoplayStep: 1.2,
  autoplayPause: 12,
} as const;

export const textXAt = (depth: number) => METRICS.textX + METRICS.indent * depth;
export const iconXAt = (depth: number) => METRICS.iconX + METRICS.indent * depth;
/** X of the vertical connector that belongs to the children of a node at `parentDepth`. */
export const trunkXAt = (parentDepth: number) => METRICS.baseX + METRICS.indent * parentDepth;

import type { LayoutNode } from '../layout/layoutTree';
import { METRICS, trunkXAt } from '../layout/metrics';

/** Neutral tree lines: one trunk per parent plus an elbow per child. */
export function baseLinesPath(root: LayoutNode): string {
  const segments: string[] = [];
  const visit = (parent: LayoutNode) => {
    const last = parent.children.at(-1);
    if (last) {
      const x = trunkXAt(parent.node.depth);
      segments.push(`M${x} ${parent.centerY + METRICS.branchDrop}V${last.centerY}`);
      parent.children.forEach((child) => segments.push(`M${x} ${child.centerY}H${x + METRICS.elbow}`));
    }
    parent.children.forEach(visit);
  };
  visit(root);
  return segments.join(' ');
}

/** Glowing path from the root down to the last node of `trail`. */
export function highlightPath(root: LayoutNode, trail: readonly LayoutNode[]): string {
  const start = `M${METRICS.baseX} ${root.centerY + METRICS.rootDrop}`;
  const steps = trail.map((step, i) => {
    const x = trunkXAt(i);
    return `H${x} V${step.centerY} H${x + METRICS.elbow}`;
  });
  return [start, ...steps].join(' ');
}

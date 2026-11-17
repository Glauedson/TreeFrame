import type { Theme } from '../domain/types';
import { METRICS } from '../layout/metrics';

const FADE_IN = 0.2;
const HOLD_UNTIL = 1.2;
const FADE_OUT = 1.5;

/** Seconds for one full autoplay loop: every node lights up once, then a pause. */
export const autoplayCycle = (litNodes: number): number =>
  litNodes * METRICS.autoplayStep + METRICS.autoplayPause;

const pct = (seconds: number, cycle: number) => ((seconds / cycle) * 100).toFixed(2);

export function buildStyles(theme: Theme, litNodes: number): string {
  const cycle = autoplayCycle(litNodes);
  return `
text{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:14px}
.base{fill:none;stroke:${theme.line};stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hl{fill:none;stroke:var(--c);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:0;filter:url(#glow);animation:auto ${cycle}s linear infinite}
@keyframes auto{0%{opacity:0}${pct(FADE_IN, cycle)}%{opacity:1}${pct(HOLD_UNTIL, cycle)}%{opacity:1}${pct(FADE_OUT, cycle)}%{opacity:0}100%{opacity:0}}
.hit{fill:transparent;pointer-events:all}
.ic{fill:none;stroke:${theme.icon};stroke-width:1.6;stroke-linejoin:round;transition:stroke .15s}
.nm{fill:${theme.name};font-weight:600;transition:fill .15s}
.cm{fill:${theme.comment};transition:fill .15s}
.n:hover>.hl{opacity:1;animation:none}
.n:hover>.row .ic{stroke:var(--c)}
.n:hover>.row .nm{fill:var(--c)}
.n:hover>.row .cm{fill:${theme.commentActive}}
.n:hover>.row .hit{fill:${theme.rowHover}}
.rt{font-weight:700;font-size:16px}
@media (prefers-reduced-motion:reduce){.hl{animation:none}}`.trim();
}

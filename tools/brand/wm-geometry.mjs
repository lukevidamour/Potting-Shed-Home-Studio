// Geometry shared by the Home Studio wordmark builder: reading the Potting Shed logo's outlines, curves, boxes.
// Taken from Pinboard's scripts/wordmark.mjs (the pinboard wordmark), so both are drawn by the same rules.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';


export const XH = 22.796; // x-height: the top of the i and the n's stem
export const BASE = 91.137; // baseline
const R = 3.665; // the rounded corner on a stem top
const K = 0.5523; // a quarter circle as a curve

// ------------------------------------------------------------------ outlines
// Just enough SVG path handling to take the logo apart and put it back
// together: every outline becomes lines (L) and curves (C), in absolute units.

function arcToCurves(x1, y1, rx, ry, phi, large, sweep, x2, y2) {
  const a = (phi * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lam = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  let co = Math.sqrt(Math.max(0, (rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp) / (rx * rx * yp * yp + ry * ry * xp * xp)));
  if (large === sweep) co = -co;
  const cxp = (co * rx * yp) / ry, cyp = (-co * ry * xp) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const angle = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = angle(1, 0, (xp - cxp) / rx, (yp - cyp) / ry);
  let dt = angle((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI;
  else if (sweep && dt < 0) dt += 2 * Math.PI;
  const n = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9));
  const h = dt / n, k = (4 / 3) * Math.tan(h / 4);
  const at = (t) => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos];
  const tan = (t) => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos];
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = t1 + i * h, e = s + h;
    const [ax, ay] = at(s), [bx, by] = i === n - 1 ? [x2, y2] : at(e), [sx, sy] = tan(s), [ex, ey] = tan(e);
    out.push({ type: 'C', x1: ax + k * sx, y1: ay + k * sy, x2: bx - k * ex, y2: by - k * ey, x: bx, y: by });
  }
  return out;
}

export function parse(d) {
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/g);
  let i = 0;
  const num = () => parseFloat(tokens[i++]);
  const flag = () => {
    const t = tokens[i];
    if (t.length > 1) { tokens[i] = t.slice(1); return +t[0]; } // flags can be run together: "01"
    i++;
    return +t;
  };
  const subs = [];
  let sp = null, x = 0, y = 0, cmd = '', last = null;
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case 'M':
        x = ox + num(); y = oy + num();
        sp = { x, y, segs: [] };
        subs.push(sp);
        cmd = rel ? 'l' : 'L';
        last = null;
        continue;
      case 'L': x = ox + num(); y = oy + num(); sp.segs.push({ type: 'L', x, y }); last = null; break;
      case 'H': x = (rel ? x : 0) + num(); sp.segs.push({ type: 'L', x, y }); last = null; break;
      case 'V': y = (rel ? y : 0) + num(); sp.segs.push({ type: 'L', x, y }); last = null; break;
      case 'C': {
        const s = { type: 'C', x1: ox + num(), y1: oy + num(), x2: ox + num(), y2: oy + num(), x: ox + num(), y: oy + num() };
        sp.segs.push(s); x = s.x; y = s.y; last = s; break;
      }
      case 'S': {
        const x1 = last ? 2 * x - last.x2 : x, y1 = last ? 2 * y - last.y2 : y;
        const s = { type: 'C', x1, y1, x2: ox + num(), y2: oy + num(), x: ox + num(), y: oy + num() };
        sp.segs.push(s); x = s.x; y = s.y; last = s; break;
      }
      case 'A': {
        const rx = num(), ry = num(), phi = num(), large = flag(), sweep = flag();
        const ex = ox + num(), ey = oy + num();
        sp.segs.push(...arcToCurves(x, y, rx, ry, phi, large, sweep, ex, ey));
        x = ex; y = ey; last = null; break;
      }
      case 'Z':
        x = sp.x; y = sp.y; last = null;
        if (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) throw new Error('numbers after Z');
        continue;
      default: throw new Error(`can't read ${cmd}`);
    }
  }
  return subs;
}

const map = (sp, f) => {
  const [x, y] = f(sp.x, sp.y);
  return {
    x, y,
    segs: sp.segs.map((s) => {
      const [px, py] = f(s.x, s.y);
      if (s.type === 'L') return { type: 'L', x: px, y: py };
      const [x1, y1] = f(s.x1, s.y1), [x2, y2] = f(s.x2, s.y2);
      return { type: 'C', x1, y1, x2, y2, x: px, y: py };
    }),
  };
};
const move = (subs, dx) => subs.map((sp) => map(sp, (x, y) => [x + dx, y]));
const mirror = (subs, about) => subs.map((sp) => map(sp, (x, y) => [2 * about - x, y]));

// Points along an outline, curves included, for measuring.
export function points(sp, steps = 24) {
  const out = [[sp.x, sp.y]];
  let px = sp.x, py = sp.y;
  for (const s of sp.segs) {
    if (s.type === 'L') out.push([s.x, s.y]);
    else for (let k = 1; k <= steps; k++) out.push(bez(px, py, s, k / steps));
    px = s.x; py = s.y;
  }
  return out;
}
const bez = (px, py, s, t) => {
  const u = 1 - t;
  return [u * u * u * px + 3 * u * u * t * s.x1 + 3 * u * t * t * s.x2 + t * t * t * s.x, u * u * u * py + 3 * u * u * t * s.y1 + 3 * u * t * t * s.y2 + t * t * t * s.y];
};
export function box(subs) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const sp of subs) for (const [x, y] of points(sp)) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return { x0, x1, y0, y1 };
}

// Split a curve at t (de Casteljau): the part before and the part after.
function split(px, py, s, t) {
  const lerp = (a, b) => a + (b - a) * t;
  const ax = lerp(px, s.x1), ay = lerp(py, s.y1), bx = lerp(s.x1, s.x2), by = lerp(s.y1, s.y2), cx = lerp(s.x2, s.x), cy = lerp(s.y2, s.y);
  const dx = lerp(ax, bx), dy = lerp(ay, by), ex = lerp(bx, cx), ey = lerp(by, cy);
  const [mx, my] = [lerp(dx, ex), lerp(dy, ey)];
  return [{ type: 'C', x1: ax, y1: ay, x2: dx, y2: dy, x: mx, y: my }, { type: 'C', x1: ex, y1: ey, x2: cx, y2: cy, x: s.x, y: s.y }];
}
// Where along a curve x (or y) reaches v, for a curve that only goes one way.
function solve(px, py, s, v, axis) {
  let lo = 0, hi = 1;
  const f = (t) => bez(px, py, s, t)[axis] - v;
  const up = f(1) > f(0);
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if ((f(mid) < 0) === up) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
const starts = (sp) => sp.segs.map((s, k) => (k ? [sp.segs[k - 1].x, sp.segs[k - 1].y] : [sp.x, sp.y]));
const near = (a, b, tol = 0.01) => Math.abs(a - b) < tol;

// A rounded corner, as on the logo's stem tops: from (ax, ay) to (bx, by),
// turning through a quarter circle.
function corner(ax, ay, bx, by, horizontalFirst) {
  return horizontalFirst
    ? { type: 'C', x1: ax + (bx - ax) * K, y1: ay, x2: bx, y2: by - (by - ay) * K, x: bx, y: by }
    : { type: 'C', x1: ax, y1: ay + (by - ay) * K, x2: bx - (bx - ax) * K, y2: by, x: bx, y: by };
}


export function bandBox(subs) {
  let x0 = Infinity, x1 = -Infinity;
  for (const sp of subs) for (const [x, y] of points(sp, 60)) if (y >= XH - 0.01 && y <= BASE + 0.01) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  return { x0, x1 };
}


export { bez, split, solve, starts, near, corner, move, mirror, map, K, R };

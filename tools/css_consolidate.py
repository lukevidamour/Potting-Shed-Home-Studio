#!/usr/bin/env python3
"""Consolidate a stylesheet that has grown in layers into one section per component, without changing what it does.

    python3 tools/css_consolidate.py home-studio.css out.css [--pin a,b,c]

1. Every rule is read with its conditions (@media, @container). Selector lists that span components are split, which
   changes nothing: `a, b { x }` and `a { x } b { x }` are the same.
2. A declaration that the same selector overrides later under the same conditions can never win, so it is removed.
3. Rules are gathered by component, keeping their original order inside each component. Components are ordered by where
   their last rule stood, so "later layers win" still holds between components wherever it did.
Prove the result with tools/qa/snap.mjs (record before, record after, compare)."""
import re, sys
from collections import OrderedDict, defaultdict

SHORT = {
    'margin': ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'], 'padding': ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    'border': ['border-top', 'border-right', 'border-bottom', 'border-left', 'border-color', 'border-width', 'border-style', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-style'],
    'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'], 'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
    'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'],
    'background': ['background-color', 'background-image', 'background-size', 'background-position', 'background-repeat', 'background-clip', 'background-origin', 'background-attachment'],
    'inset': ['top', 'right', 'bottom', 'left'], 'gap': ['row-gap', 'column-gap'], 'outline': ['outline-color', 'outline-style', 'outline-width'],
    'transition': ['transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay'],
    'animation': ['animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-fill-mode', 'animation-iteration-count', 'animation-direction', 'animation-play-state'],
    'flex': ['flex-grow', 'flex-shrink', 'flex-basis'], 'overflow': ['overflow-x', 'overflow-y'], 'font': ['font-size', 'font-weight', 'font-style', 'font-family', 'line-height', 'font-variant'],
    'place-items': ['align-items', 'justify-items'], 'place-content': ['align-content', 'justify-content'], 'text-decoration': ['text-decoration-line', 'text-decoration-color', 'text-decoration-style', 'text-decoration-thickness'],
    'mask': ['mask-image', 'mask-size', 'mask-position', 'mask-repeat'], '-webkit-mask': ['-webkit-mask-image', '-webkit-mask-size', '-webkit-mask-position', '-webkit-mask-repeat'],
    'grid-template': ['grid-template-columns', 'grid-template-rows', 'grid-template-areas'], 'grid-area': ['grid-row-start', 'grid-column-start', 'grid-row-end', 'grid-column-end'],
}
GENERIC = {'app', 'glass', 'sr', 'solid'}


def split_top(s, sep):
    out, depth, cur, q = [], 0, [], None
    for ch in s:
        if q:
            cur.append(ch)
            if ch == q: q = None
            continue
        if ch in '"\'': q = ch; cur.append(ch); continue
        if ch in '([': depth += 1
        elif ch in ')]': depth -= 1
        if ch == sep and depth == 0: out.append(''.join(cur)); cur = []
        else: cur.append(ch)
    out.append(''.join(cur))
    return [x.strip() for x in out if x.strip()]


def parse(text, ctx, items, notes):
    i, n = 0, len(text)
    while i < n:
        m = re.match(r'\s+', text[i:])
        if m: i += m.end(); continue
        if text.startswith('/*', i):
            j = text.index('*/', i) + 2; notes.append(text[i:j]); i = j; continue
        # read the prelude up to { or ;
        j, q, depth = i, None, 0
        while j < n:
            ch = text[j]
            if q:
                if ch == q: q = None
            elif ch in '"\'': q = ch
            elif ch == '(': depth += 1
            elif ch == ')': depth -= 1
            elif ch in '{;' and depth == 0: break
            j += 1
        prelude = text[i:j].strip()
        if j >= n or text[j] == ';':
            items.append({'raw': prelude + ';', 'ctx': ctx, 'notes': notes[:]}); notes.clear(); i = j + 1; continue
        k, depth, q = j + 1, 1, None
        while k < n and depth:
            ch = text[k]
            if q:
                if ch == q: q = None
            elif ch in '"\'': q = ch
            elif text.startswith('/*', k): k = text.index('*/', k) + 1
            elif ch == '{': depth += 1
            elif ch == '}': depth -= 1
            k += 1
        body = text[j + 1:k - 1]
        if prelude.startswith(('@media', '@container', '@supports')):
            parse(body, ctx + (re.sub(r'\s+', ' ', prelude),), items, notes)
        elif prelude.startswith('@'):
            items.append({'raw': prelude + '{' + body.strip() + '}', 'ctx': ctx, 'notes': notes[:], 'at': prelude}); notes.clear()
        else:
            body = re.sub(r'/\*.*?\*/', '', body, flags=re.S)
            decls = []
            for d in split_top(body, ';'):
                if ':' not in d: continue
                p, v = d.split(':', 1); v = v.strip(); imp = v.endswith('!important')
                decls.append([p.strip().lower() if not p.strip().startswith('--') else p.strip(), v, imp])
            items.append({'sels': split_top(re.sub(r'\s+', ' ', prelude), ','), 'decls': decls, 'ctx': ctx, 'notes': notes[:]}); notes.clear()
        i = k


def component(sel):
    s = re.sub(r':(?:has|not|is|where)\(', '(', sel)
    if re.match(r'^:root(\[[^\]]*\])?(:not\([^)]*\))?$', sel.strip()) or sel.strip() in ('html', 'body', '*', 'html,body'): return 'tokens' if sel.strip().startswith(':root') else 'base'
    for c in re.findall(r'\.([a-zA-Z_][\w-]*)', s):
        base = c.split('__')[0]
        if base in GENERIC or base.startswith('is-') or base.startswith('has-'): continue
        return base
    m = re.search(r'\[data-([a-z-]+)', s)
    if m and m.group(1) != 'theme': return 'data-' + m.group(1)
    return 'base'


def main():
    src, dst = sys.argv[1], sys.argv[2]
    pins = sys.argv[sys.argv.index('--pin') + 1].split(',') if '--pin' in sys.argv else []
    text = open(src).read()
    items, notes = [], []
    parse(text, (), items, notes)
    rules = []
    for pos, it in enumerate(items):
        if 'raw' in it: it['pos'] = pos; it['comp'] = 'motion' if it.get('at', '').startswith('@keyframes') else 'base'; rules.append(it); continue
        groups = OrderedDict()
        for s in it['sels']: groups.setdefault(component(s), []).append(s)
        for gi, (comp, sels) in enumerate(groups.items()):
            rules.append({'sels': sels, 'decls': [d[:] for d in it['decls']], 'ctx': it['ctx'], 'notes': it['notes'] if gi == 0 else [], 'pos': pos, 'comp': comp})
    # dead declarations: overridden later by the same selector under the same conditions
    later = defaultdict(list)  # (ctx, selector) -> [(index, prop, important)]
    for idx, r in enumerate(rules):
        if 'raw' in r: continue
        for s in r['sels']:
            for p, v, imp in r['decls']: later[(r['ctx'], s)].append((idx, p, imp))
    removed = 0
    for idx, r in enumerate(rules):
        if 'raw' in r: continue
        keep = []
        for di, (p, v, imp) in enumerate(r['decls']):
            dead_everywhere = True
            if any(q == p or p in SHORT.get(q, ()) for q, _, _ in r['decls'][di + 1:] if True) and any((q == p or p in SHORT.get(q, ())) and (i2 >= imp) for q, _, i2 in r['decls'][di + 1:]):
                removed += 1; continue                                   # overridden further down the same rule
            for s in r['sels']:
                if not any(j > idx and (q == p or p in SHORT.get(q, ())) and (i2 or not imp) for j, q, i2 in later[(r['ctx'], s)]): dead_everywhere = False; break
            if dead_everywhere: removed += 1
            else: keep.append([p, v, imp])
        r['decls'] = keep
    rules = [r for r in rules if 'raw' in r or r['decls']]
    # keyframes: the last definition of a name is the one in force
    lastkf = {}
    for idx, r in enumerate(rules):
        if 'raw' in r and r.get('at', '').startswith('@keyframes'): lastkf[r['at']] = idx
    rules = [r for idx, r in enumerate(rules) if not ('raw' in r and r.get('at', '').startswith('@keyframes') and lastkf[r['at']] != idx)]
    # gather by component; components ordered by where their last rule stood
    comps = OrderedDict()
    for r in rules: comps.setdefault(r['comp'], []).append(r)
    order = sorted(comps, key=lambda c: (0 if c == 'tokens' else 1 if c == 'base' else 2 if c == 'motion' else 3, pins.index(c) if c in pins else -1, max(x['pos'] for x in comps[c]) if c not in pins else 0))
    order = [c for c in order if c not in pins] + [c for c in pins if c in comps]
    out = ['/* Home Studio styles. One section per component, in the order that later sections may override earlier ones.\n   Made from the layered stylesheet by tools/css_consolidate.py; edit a component in its own section. */\n']
    for c in order:
        out.append('\n/* ===== ' + c + ' ===== */')
        cur = ()
        for r in comps[c]:
            if r['ctx'] != cur:
                out.extend('}' for _ in cur); cur = r['ctx']; out.extend(a + '{' for a in cur)
            for nt in r.get('notes', []):
                if re.match(r'/\*\s*(=+|-{4,})', nt) and len(nt) < 90: continue      # bare layer banners
                out.append(('  ' if cur else '') + nt)
            if 'raw' in r: out.append(('  ' if cur else '') + r['raw'])
            else: out.append(('  ' if cur else '') + ','.join(r['sels']) + '{' + ';'.join(p + ':' + v for p, v, _ in r['decls']) + '}')
        out.extend('}' for _ in cur)
    open(dst, 'w').write('\n'.join(out) + '\n')
    print(f'{len(items)} rules read, {removed} dead declarations removed, {len(rules)} rules written in {len(order)} components; {len(text) // 1024}KB -> {len(open(dst).read()) // 1024}KB')


if __name__ == '__main__':
    main()

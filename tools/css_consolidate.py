#!/usr/bin/env python3
"""Consolidate a stylesheet that has grown in layers into one section per component, without changing what it does.

    python3 tools/css_consolidate.py home-studio.css out.css

1. Every rule is read with its conditions (@media, @container). Selector lists that span components are split, which
   changes nothing: `a, b { x }` and `a { x } b { x }` are the same.
2. A declaration that the same selector overrides later under the same conditions can never win, so it is removed.
3. An earlier rule is merged into the last rule that has the same selectors and conditions, declaration by declaration,
   and only where no rule in between sets that property at the same weight, so no other rule can change from winning to
   losing. Rule order is otherwise untouched.
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


def specificity(sel):
    """(ids, classes, elements) of one selector; :not/:is/:has count their most specific argument, :where counts nothing."""
    s = re.sub(r'::?(before|after|placeholder|selection|first-line|first-letter|-webkit-[\w-]+|-moz-[\w-]+)', ' E ', sel)
    def inner(m):
        fn, args = m.group(1), m.group(2)
        if fn == 'where': return ''
        best = max((specificity(a) for a in split_top(args, ',')), default=(0, 0, 0))
        return ' ' + '#' * best[0] + '.' * 0 + ''.join(' .x' for _ in range(best[1])) + ''.join(' e' for _ in range(best[2])) + ''.join(' #x' for _ in range(0))
    prev = None
    while prev != s:
        prev = s; s = re.sub(r':(not|is|has|where)\(((?:[^()]|\([^()]*\))*)\)', inner, s)
    s = re.sub(r':(nth-[\w-]+|lang|dir)\([^)]*\)', ':x', s)
    a = len(re.findall(r'#[\w-]+', s)); b = len(re.findall(r'\.[\w-]+|\[[^\]]*\]|:[\w-]+', s))
    c = len(re.findall(r'(?:^|[\s>+~])([a-zA-Z][\w-]*)', re.sub(r'\.[\w-]+|\[[^\]]*\]|:[\w-]+|#[\w-]+', '', ' ' + s)))
    return (a, b, c)


def covers(q, p):
    return q == p or p in SHORT.get(q, ()) or q in SHORT.get(p, ())


def main():
    src, dst = sys.argv[1], sys.argv[2]
    text = open(src).read()
    items, notes = [], []
    parse(text, (), items, notes)
    rules = [dict(it, pos=pos) for pos, it in enumerate(items)]
    # 1. dead declarations: overridden later by the same selector under the same conditions
    later = defaultdict(list)
    for idx, r in enumerate(rules):
        if 'raw' in r: continue
        for sl in r['sels']:
            for p, v, imp in r['decls']: later[(r['ctx'], sl)].append((idx, p, imp))
    removed = 0
    for idx, r in enumerate(rules):
        if 'raw' in r: continue
        keep = []
        for di, (p, v, imp) in enumerate(r['decls']):
            if any((q == p or p in SHORT.get(q, ())) and (i2 or not imp) for q, _, i2 in r['decls'][di + 1:]): removed += 1; continue
            if all(any(j > idx and (q == p or p in SHORT.get(q, ())) and (i2 or not imp) for j, q, i2 in later[(r['ctx'], sl)]) for sl in r['sels']): removed += 1
            else: keep.append([p, v, imp])
        r['decls'] = keep
    # 2. one rule per selector: an earlier rule's declarations move into the last rule with the same selectors and conditions,
    #    but only when nothing in between could then lose to them (no rule in between sets that property at equal weight)
    spec = {}
    for r in rules:
        if 'raw' not in r: r['spec'] = set(specificity(x) for x in r['sels'])
    last = {}
    for idx, r in enumerate(rules):
        if 'raw' not in r: last[(r['ctx'], tuple(r['sels']))] = idx
    moved = 0
    for idx, r in enumerate(rules):
        if 'raw' in r or not r['decls']: continue
        tgt = last[(r['ctx'], tuple(r['sels']))]
        if tgt == idx: continue
        between = [x for x in rules[idx + 1:tgt] if 'raw' not in x and x['decls'] and (x['spec'] & r['spec'])]
        stay, go = [], []
        for d in r['decls']:
            (stay if any(covers(q, d[0]) and i2 == d[2] for x in between for q, _, i2 in x['decls']) else go).append(d)
        if go:
            # they go in front of the last rule's own declarations, so those still win
            rules[tgt]['decls'] = go + rules[tgt]['decls']; rules[tgt]['notes'] = r.get('notes', []) + rules[tgt].get('notes', []) if not stay else rules[tgt].get('notes', [])
            r['decls'] = stay; moved += len(go)
            if not stay: r['notes'] = []
    rules = [r for r in rules if 'raw' in r or r['decls']]
    lastkf = {}
    for idx, r in enumerate(rules):
        if 'raw' in r and r.get('at', '').startswith('@keyframes'): lastkf[r['at']] = idx
    rules = [r for idx, r in enumerate(rules) if not ('raw' in r and r.get('at', '').startswith('@keyframes') and lastkf[r['at']] != idx)]
    out = ['/* Home Studio styles. Each selector is written once wherever that is safe: a later rule for the same selector has\n   absorbed the earlier ones, and declarations that could never win have been removed (tools/css_consolidate.py).\n   Order still matters between different selectors of equal weight, so add to a component beside its existing rules. */\n']
    cur = ()
    for r in rules:
        if r['ctx'] != cur:
            out.extend('}' for _ in cur); cur = r['ctx']; out.extend(a + '{' for a in cur)
        for nt in r.get('notes', []): out.append(('  ' if cur else '') + nt)
        if 'raw' in r: out.append(('  ' if cur else '') + r['raw'])
        else: out.append(('  ' if cur else '') + ','.join(r['sels']) + '{' + ';'.join(p + ':' + v for p, v, _ in r['decls']) + '}')
    out.extend('}' for _ in cur)
    open(dst, 'w').write('\n'.join(out) + '\n')
    sels = [tuple(r['sels']) + r['ctx'] for r in rules if 'raw' not in r]
    print(f'{len(items)} rules read; {removed} dead declarations removed; {moved} declarations merged into their selector\'s last rule; {len(rules)} rules written ({len(sels) - len(set(sels))} selectors still appear more than once, kept apart for safety); {len(text) // 1024}KB -> {len(open(dst).read()) // 1024}KB')


if __name__ == '__main__':
    main()

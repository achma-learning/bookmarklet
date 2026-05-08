#!/usr/bin/env node
/**
 * Bookmarklet validator. Exits non-zero if any payload violates invariants.
 *
 *   node .scripts/check-bookmarklets.js
 *
 * Checks (per file under bookmarklets/ and downloaders/, excluding
 *  _generate.js):
 *   1. Starts with `javascript:(`  — IIFE prefix, mandatory.
 *   2. Single line  — bookmark URL fields don't reliably accept newlines.
 *   3. Lenient percent-decode + `new Function(body)` syntax check —
 *      mirrors how a browser actually evaluates `javascript:` URLs. This
 *      also catches the classic foot-gun where a `//` line comment in a
 *      one-line bookmarklet eats the rest of the source.
 *   4. Length warning above 7,500 chars (some browsers cap bookmark URLs).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOTS = ['bookmarklets', 'downloaders'];
const EXCLUDE = new Set(['_generate.js']);
const MAX_LEN = 7500;

function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else if (ent.isFile() && ent.name.endsWith('.js') && !EXCLUDE.has(ent.name)) yield p;
  }
}

let errs = 0, warns = 0, ok = 0;
const fail = (f, msg) => { console.error(`  FAIL  ${f}\n         ${msg}`); errs++; };
const warn = (f, msg) => { console.warn(`  WARN  ${f}\n         ${msg}`); warns++; };

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const raw = fs.readFileSync(file, 'utf8');
    const trimmed = raw.replace(/\n$/, '');

    if (!trimmed.startsWith('javascript:(')) {
      fail(file, `must start with "javascript:(" — got "${trimmed.slice(0, 14)}"`);
      continue;
    }
    if (trimmed.includes('\n')) {
      fail(file, `contains literal newline — must be single line`);
      continue;
    }
    if (trimmed.length > MAX_LEN) {
      warn(file, `${trimmed.length} chars exceeds soft cap ${MAX_LEN} — some browsers will truncate`);
    }

    let body = trimmed.slice('javascript:'.length);
    body = body.replace(/%([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    try {
      new Function(body);
    } catch (e) {
      fail(file, `syntax: ${String(e).split('\n')[0]}`);
      continue;
    }
    ok++;
  }
}
console.log(`\n  ${ok} ok, ${warns} warnings, ${errs} errors`);
process.exit(errs ? 1 : 0);

# Bookmarklet — AI Context File
_Last synced: 2026-05-08 @ eb0c843_

## 1. What This Is (Plain English)
- **In one sentence:** A personal collection of one-click browser bookmarklets (tiny JavaScript snippets you drag onto your bookmarks bar) for force-enabling copy on locked pages, downloading social videos, picking colors, dark mode, OCR, page editing, etc.
- **Why it exists:** Owner gets sick of hostile websites — "you can't copy this", "no right-click", paywalls, no-download videos — and prefers a 200-line bookmarklet over a 50MB extension. Also a personal stash so they stop losing useful one-liners.
- **Who uses it:** Mostly the owner. The `index.html` showcase page is public-friendly, but no auth, no analytics, no users to worry about.
- **Vibe:** Polished personal toolkit. Every file has one canonical home, every payload is single-line and IIFE-wrapped, and a validator script enforces the rules.

## 2. How To Run It
- **Setup once:** None. No `npm install`, no virtualenv. Clone and you're done.
- **Run dev:** Open `index.html` in any browser (`xdg-open index.html` / `open index.html`). It's a static page.
- **Build / deploy:** No build. Push to `main` and `index.html` is the entry point. _Not yet figured out:_ no Pages config so unclear whether the repo is published anywhere.
- **Use a bookmarklet:** Open any `.js` file under `bookmarklets/` or `downloaders/`, copy the entire `javascript:...` line, paste it into a new bookmark's URL field. Or drag a `[button]` from `index.html` onto your bookmarks bar.
- **Regenerate per-site downloaders:** `node downloaders/_generate.js` (Node 18+, zero deps).
- **Validate every bookmarklet:** `node .scripts/check-bookmarklets.js` — fails the run if any payload is malformed.
- **Required env vars:** None. There is no `.env.example`.

## 3. Tech Stack
- **Language + runtime:** Vanilla JavaScript only. No transpiler. The generator and validator run on Node (any recent version — uses `fs`, `path`, `JSON`, no externals). _Not yet figured out:_ no `.nvmrc`, so Node version is unpinned.
- **Framework / key libraries:** None. Zero dependencies, zero lockfile.
- **What kind of project:** A grab-bag of standalone browser bookmarklets + a static showcase HTML page + a tiny Node generator + a Node validator. Not a library, not an app — a **toolkit repo**.
- **External services:** Each downloader bookmarklet opens a third-party download site (cobalt.tools, ssyoutube.com, snapinsta.app, fdown.net, ssstwitter.com, snaptik.app, redditsave.com, …). The bookmarklets only ever pass the current page URL — no API keys, no auth.

## 4. Code Map (The Important Files Only)
- `index.html` — Showcase web page. Hand-coded `<div class="tool-card">` per bookmarklet (NOT data-driven). Arch-Linux-themed dark UI, in-page search + category filter. (`index.html:412`+ for cards, `index.html:610` for filter logic.)
- `bookmarklets/` — Canonical drag-and-drop bookmarklet payloads. 73 `.js` files split across 14 numbered category folders (`01-tips/` … `14-misc/`, plus `_references/`). Every file is a single-line `javascript:(…)();` URL — paste straight into a bookmark.
- `downloaders/` — One bookmarklet per social-media site. 13 generated payloads (youtube, instagram, facebook, x-twitter, tiktok, reddit, pinterest, linkedin, vimeo, soundcloud, twitch, snapchat, universal). All emitted by `downloaders/_generate.js`.
- `downloaders/_generate.js` — Single source of truth for the per-site downloaders. Edit one entry in `SITES`, rerun, get a new `.js`.
- `.scripts/check-bookmarklets.js` — Validator. Walks `bookmarklets/` and `downloaders/`, enforces every rule in §5. Run before commit.
- `src/` — Readable, unminified sources of the bigger bookmarklets. `src/force-copy.js` is the documented original of `bookmarklets/02-force-copy/force-copy.js`. `src/_wip/` is in-progress.
- `data/bookmarklets-data.js` — Half-finished `const bookmarkletsData = [...]` seed for a future data-driven `index.html`.
- `data/inventory.xlsx` — Owner's Excel inventory. Binary blob.
- `archive/` — Immutable historical artifacts. `bookmarks-export-2026-05-08.html` is the canonical browser-export the entire repo was rebuilt from. `index-prev.html` is the older showcase. `a11y-tools-mirror.html` is a 19MB third-party mirror. `archive/notes/` holds dev scratchpads.
- `README.md` — Public-facing usage doc.
- `CONTEXT.md` — This file. AI handoff doc.

## 5. The Bookmarklet Formula (Mandatory)
A `javascript:` URL is what a browser stores in a bookmark's location field. When the user clicks it, the browser:
1. Reads the URL string.
2. Strips the `javascript:` scheme.
3. **Lenient percent-decode** of the rest (`%20`→space, `%3C`→`<`, `%E2%9C%85`→`✅`, …).
4. Evaluates the result as JavaScript in the top frame of the active page.
5. If that evaluation **returns** a non-`undefined` value, the browser navigates to that value as a string. **This is the #1 way bookmarklets break a tab.**

Therefore every payload in this repo must follow this exact shape:

```
javascript:(function(){ /* …code… */ })();
```

…or the arrow equivalent `javascript:(()=>{ /* …code… */ })();`. Both produce `undefined` and never navigate.

### Hard rules — enforced by `.scripts/check-bookmarklets.js`
1. **Must start with `javascript:(`** — IIFE form. Bare `javascript:doStuff()` leaks variables to `window` and may return a value that hijacks the tab. (`!function(){…}()` works in JS but is rejected here for consistency.)
2. **Single line.** No literal `\n` in the file. Bookmark URL fields strip or mangle newlines depending on browser.
3. **No `//` line comments.** On a single line, `//` swallows the rest of the source. Use `/* … */` if you must comment.
4. **Lenient percent-decode + `new Function(body)` parses cleanly.** Catches the comment foot-gun, mismatched braces, stray semicolons.
5. **≤ 7,500 chars (soft cap).** Modern Chrome/Firefox accept ~64 KB but some bookmark sync tools and older browsers truncate around 8 KB.

### Soft rules — strongly encouraged
- **`'use strict';`** as the first statement inside the IIFE.
- **Wrap risky DOM lookups in try/catch** — bookmarklets run on _any_ page; the page could be hostile or weird.
- **Prefer `var` over `let`/`const`** when you want to be ES5-bookmark-bar safe; modern browsers don't care, but some embedded WebViews do.
- **Use `window.open(...)` not `location.href = ...`** if you don't want to nuke the current tab.
- **Always `void(...)` or end with a statement that returns `undefined`** if you ever break the IIFE convention. (You shouldn't.)
- **Encode user input** before injecting into HTML (`.replace(/&/g,'&amp;').replace(/</g,'&lt;')`). Hostile pages can have evil URLs.
- **Use Shadow DOM** for any modal UI to escape host-page CSS. The downloader template does this — copy that pattern.
- **Strip tracking params** when shipping URLs to a third party (`utm_*`, `fbclid`, `igshid`, `si`, `t`, `ref_*`).

### Characters that need escaping in a bookmarklet
The bookmark URL goes through a URL parser. These have to be percent-encoded **or** wrapped in JavaScript strings that the user types as a literal:

| Char | Encode as | Why |
|------|-----------|-----|
| `#`  | `%23`     | URL fragment delimiter — everything after is dropped |
| `%`  | `%25`     | percent-decoder will choke if followed by non-hex |
| literal newline | (remove) | breaks the URL |
| `"`  | OK literal in JS source, but `%22` is safer when generating | some bookmark importers mangle quotes |
| `<` `>` | OK literal | but URL-encode (`%3C` `%3E`) when embedded in HTML attributes elsewhere |

Spaces are fine literal in modern browsers but `%20` is more portable.

### One-bookmarklet template
Copy this when adding a new one:

```javascript
javascript:(function(){'use strict';try{
  /* your code here — no // comments, only /* */ */
}catch(e){console.error('[bk]',e)}})();
```

Then run `node .scripts/check-bookmarklets.js` to confirm.

## 6. Fragile Bits & Landmines
- **`index.html` is hand-coded, not data-driven.** Tempting to wire it to `bookmarklets/` — that's a real refactor (`index.html:412`+). `data/bookmarklets-data.js` is a half-finished seed.
- **`bookmarklets/06-downloader-legacy/` is intentional duplication.** Pre-refactor backups, kept on purpose.
- **`bookmarklets/08-ocr/4.js` and `.../a.js`.** Real filenames from the bookmarks export. Don't "fix".
- **`bookmarklets/02-force-copy/force-copy.js` is the minified payload; `src/force-copy.js` is the readable source.** Not auto-linked — edit both.
- **Cross-origin autofill is best-effort.** `_generate.js` tries `w.document.querySelector(...)` after `window.open` — same-origin policy silently blocks this on most modern downloaders. Clipboard fallback always runs.
- **Third-party downloader services rot.** Sites in `_generate.js`' `SITES` go down or get bought. Audit every few months.
- **4 bookmarklets currently exceed the 7,500-char soft cap** (validator warns):
  - `bookmarklets/03-translate/translate-page-to-un-launage-bk.js` (7,688)
  - `bookmarklets/08-ocr/local-ocr-bk.js` (9,056)
  - `bookmarklets/12-extractor/list-all.js` (7,777)
  - `downloaders/facebook.js` (7,631)
  Modern browsers handle them; some sync services may truncate. Trim if you can.
- **`archive/a11y-tools-mirror.html` is 19MB.** Don't `cat` it, don't index it.
- **Some `src/` files are themselves URL-encoded** (e.g. `src/list-images.js` has `%7B`, `%0A`). Treat them as already-baked payloads, not raw sources.

## 7. Current State
- **Last shipped:** Bookmarklet-formula pass — every payload now starts with `javascript:(`, is single-line, and passes the new `.scripts/check-bookmarklets.js` validator (85 ok, 0 errors, 4 length warnings). Fixed 5 non-IIFE payloads (force-copy variants, restore-rightclick, disable-javascript) and the `yt-download.js` `//` comment foot-gun. Flattened 6 multi-line `_references-*.js` launchers.
- **Working on now:** Locking the formula in.
- **Next up:**
  1. Make `index.html` data-driven from `data/bookmarklets-data.js` or the `bookmarklets/` tree.
  2. Tiny URL-encoder so `src/foo.js` ⇒ `bookmarklets/<cat>/foo.js` is a one-command rebuild.
  3. Audit third-party downloader URLs in `downloaders/_generate.js`.
  4. Trim the 4 bookmarklets that exceed the 7,500-char soft cap.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.

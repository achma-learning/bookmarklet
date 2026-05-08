# Bookmarklet — AI Context File
_Last synced: 2026-05-08 @ c0b19ed_

## 1. What This Is (Plain English)
- **In one sentence:** A personal collection of one-click browser bookmarklets (tiny JavaScript snippets you drag onto your bookmarks bar) for things like force-enabling copy on locked pages, downloading social videos, picking colors, dark mode, OCR, page editing, etc.
- **Why it exists:** Owner gets sick of hostile websites — "you can't copy this", "no right-click", paywalls, no-download videos — and prefers a 200-line bookmarklet over a 50MB extension. Also a personal stash so they stop losing useful one-liners.
- **Who uses it:** Mostly the owner. The `index.html` showcase page is public-friendly, but there's no auth, no analytics, no users to worry about.
- **Vibe:** Polished personal toolkit. The downloader system was just refactored to be senior-engineer-clean (declarative config + generator), but the rest of the repo is still a working scrapyard of `.txt` notes, `New 2.txt`, and `list +++/` — don't expect tidy.

## 2. How To Run It
- **Setup once:** None. No `npm install`, no virtualenv. Clone and you're done.
- **Run dev:** Open `index.html` in any browser (`xdg-open index.html` / `open index.html`). It's a static page.
- **Build / deploy:** No build. Hosting is GitHub Pages-style — push to `main` and `index.html` is the entry point. _Not yet figured out:_ no Pages config in `.github/` confirms whether the repo is actually published anywhere.
- **Use a bookmarklet:** Open any `.js` file under `bookmarklets/` or `extractor-scraper-downloader/`, copy the entire `javascript:...` line, paste it into a new bookmark's URL field. Or drag the `[button]` from `index.html` onto your bookmarks bar.
- **Regenerate per-site downloaders:** `node extractor-scraper-downloader/_generate.js` (Node 18+, zero deps).
- **Required env vars:** None. There is no `.env.example`.

## 3. Tech Stack
- **Language + runtime:** Vanilla JavaScript only. No transpiler. The generator runs on Node (any recent version — uses `fs`, `path`, `JSON`, no externals). _Not yet figured out:_ no `.nvmrc`, so Node version is unpinned.
- **Framework / key libraries:** None. Zero dependencies, zero lockfile.
- **What kind of project:** A grab-bag of standalone browser bookmarklets + a static showcase HTML page + a tiny Node generator script. Not a library, not an app — a **toolkit repo**.
- **External services:** Each downloader bookmarklet opens a third-party download site (cobalt.tools, ssyoutube.com, snapinsta.app, fdown.net, ssstwitter.com, snaptik.app, redditsave.com, etc.). The bookmarklets only ever pass the current page URL — no API keys, no auth.

## 4. Code Map (The Important Files Only)
- `index.html` — The showcase page. Hand-coded `<div class="tool-card">` per bookmarklet (not data-driven). Arch-Linux-themed dark UI, in-page search + category filter (`tools / i18n / privacy / design / search / system`). One file = HTML + CSS + tiny JS, no build. (`index.html:412`+ for cards, `index.html:610` for filter logic.)
- `force-copy.js` / `force-copy.min.js` — The flagship bookmarklet. 13-technique copy/paste/select unblocker. Documented header in `force-copy.js:1-30`. The `.min.js` is the actual `javascript:` payload to drag.
- `extractor-scraper-downloader/_generate.js` — **Single source of truth** for the per-site video downloaders. A declarative `SITES` object + a long `JS_TEMPLATE` runtime string that gets concatenated with a JSON config and written out as 13 separate `<site>.js` files. Edit one entry, run the script, get a new downloader.
- `extractor-scraper-downloader/<site>.js` — Generated. Each is one self-contained `javascript:` payload (~7KB) with its own modal UI. **Don't edit by hand — regenerate.**
- `bookmarklets/` — 73 backup `.js` files split out of `bookmarks_2026_5_8.html`. Organized as `01-tips/`, `02-force-copy/`, `03-translate/`, `04-qr-code/`, `05-edit-page/`, `06-downloader-legacy/`, `07-archive/`, `08-ocr/`, `09-privacy/`, `10-color-picker/`, `11-dark-mode/`, `12-extractor/`, `13-remove-media/`, `14-misc/`. Reference URLs are bundled into `_references-*.js` launchers so every backup is `.js`.
- `bookmarks_2026_5_8.html` — Netscape-format browser bookmarks export. Treat as **the canonical dump** — `bookmarklets/` was generated from it.
- `README.md` — Public-facing usage doc. Long, marketing-toned, mostly accurate.
- `GEMINI.md` — Older AI memory file. **Now partly wrong** (claims `index.html` has a `bookmarkletsData` array — it doesn't, it's hand-coded cards). Treat as obsolete.

## 5. Rules For Editing This Code
- **Zero dependencies. Period.** No `npm install`, no `package.json`. If a feature needs a library, find a way without it.
- **Vanilla JS only.** No TypeScript, no JSX, no bundler. Every `.js` file under `bookmarklets/` and `extractor-scraper-downloader/` must be a valid `javascript:` URL — single line, starts with `javascript:`, runs in any modern browser.
- **One bookmarklet = one `.js` file.** New file extensions are `.js`. No `.ts`, no `.txt` for new bookmarklets.
- **Don't hand-edit `extractor-scraper-downloader/<site>.js`.** Edit `_generate.js` and regenerate. Hand-edits will be lost.
- **Single-line bookmarklets.** Generated downloaders strip newlines on emit (`_generate.js` end). Keep that invariant.
- **Shadow DOM for any new modal UI** (see how the downloader template uses `attachShadow({mode:'closed'})`) — host page CSS will eat unprotected styles alive.
- **Sanitize URL display.** When echoing the page URL into HTML, escape `&` and `<` (the downloader template does `.replace(/&/g,"&amp;").replace(/</g,"&lt;")`). Don't skip this.
- **Strip tracking params** in any new "open URL elsewhere" flow (`utm_*`, `fbclid`, `igshid`, `si`, `t`, `ref_*`, …). Pattern is in `_generate.js` `clean()` helper.
- **Validate after generating.** `node --check` on every emitted file.

## 6. Fragile Bits & Landmines
- **`index.html` is hand-coded, not data-driven.** `GEMINI.md:18` claims a `bookmarkletsData` array drives it. That was true historically; the current file is static `<div class="tool-card">` blocks per bookmarklet (`index.html:412`+). If you're tempted to "wire it up to the bookmarklets/ folder", that's a real refactor — it'll touch every card.
- **Filenames with spaces and parens.** `bookmarks_2026_5_8.html`, `list +++/`, `New folder/`, `New 2.txt`, `data.txt`, `data.xlsx`, files like `extractor ADVANCED - FILTER BY TYPE.txt`. Don't blindly rename — the showcase HTML or the owner's notes may reference them. Quote paths in shell commands.
- **`other/a11y-tools.combookmarklets.html` is 19MB.** Don't `cat` it casually, don't index it — it's an offline mirror of someone else's bookmarklet site, kept for reference only.
- **`bookmarklets/06-downloader-legacy/` is the old downloader collection.** Looks redundant next to the new `extractor-scraper-downloader/` files — it isn't. Kept as a backup of pre-refactor versions. Don't delete.
- **`bookmarklets/08-ocr/4.js` and `bookmarklets/08-ocr/a.js`.** Yes, those are real filenames — that's how they were named in the bookmarks export. Don't "fix" them by renaming; downstream copy-paste will break.
- **`Zone.Identifier` files in `list +++/`.** Windows NTFS metadata leftovers. Harmless. Don't bother deleting.
- **Bookmarklet length limits.** Some browsers cap bookmark URLs around 2KB-8KB. The downloader payloads (~7KB) sit on the edge. Keep an eye if adding services.
- **Cross-origin autofill is best-effort.** `_generate.js` tries to populate the destination's input via `w.document.querySelector(...)` — same-origin policy will silently block this on most modern downloaders. Always copy URL to clipboard as a hard fallback (already done).
- **Third-party downloader services rot.** Sites listed in `_generate.js`' `SITES` go down, get bought, or start showing porn ads. Audit links every few months.
- **`force-copy.min.js` is a manual hand-minified version of `force-copy.js`.** No build step links them. If you edit one, edit both.

## 7. Current State
- **Last shipped (PR #6, branch `claude/enhance-video-bookmarklet-Vhkfn`, commit c0b19ed):**
  - Parsed `bookmarks_2026_5_8.html` and exploded every bookmarklet into its own `.js` file under `bookmarklets/<category>/` (73 files, 14 categories).
  - Replaced ad-hoc legacy downloaders with 13 generated, declarative-config-driven per-site bookmarklets in `extractor-scraper-downloader/` (youtube, instagram, facebook, x-twitter, tiktok, reddit, pinterest, linkedin, vimeo, soundcloud, twitch, snapchat, universal).
  - Each downloader: shadow-DOM modal, tracking-param stripping, hostname rewriting, ID extraction for deep-link services, `1`–`9` keyboard nav, last-used-service memory, clipboard fallback, best-effort autofill.
- **Working on now:** Setting up `CONTEXT.md` so the next AI doesn't have to re-discover the layout.
- **Next up:**
  1. Decide whether to make `index.html` data-driven from `bookmarklets/` so the showcase auto-stays in sync with the file tree.
  2. Sanity-check that the third-party downloader URLs in `_generate.js` actually still work in 2026.
  3. Sweep `list +++/`, `other/`, `new 2.txt`, `data.txt` — keep what's useful, archive the rest.

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.

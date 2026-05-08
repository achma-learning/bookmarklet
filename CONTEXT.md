# Bookmarklet — AI Context File
_Last synced: 2026-05-08 @ ddbf69e (pre-restructure: c0b19ed)_

## 1. What This Is (Plain English)
- **In one sentence:** A personal collection of one-click browser bookmarklets (tiny JavaScript snippets you drag onto your bookmarks bar) for force-enabling copy on locked pages, downloading social videos, picking colors, dark mode, OCR, page editing, etc.
- **Why it exists:** Owner gets sick of hostile websites — "you can't copy this", "no right-click", paywalls, no-download videos — and prefers a 200-line bookmarklet over a 50MB extension. Also a personal stash so they stop losing useful one-liners.
- **Who uses it:** Mostly the owner. The `index.html` showcase page is public-friendly, but no auth, no analytics, no users to worry about.
- **Vibe:** Polished personal toolkit. The repo was just rebuilt from the ground up — every file has one canonical home, no duplicates, no Windows `Zone.Identifier` debris, no `New Text Document.txt`. Treat it like a tidy library, not a scrapyard.

## 2. How To Run It
- **Setup once:** None. No `npm install`, no virtualenv. Clone and you're done.
- **Run dev:** Open `index.html` in any browser (`xdg-open index.html` / `open index.html`). It's a static page.
- **Build / deploy:** No build. Push to `main` and `index.html` is the entry point. _Not yet figured out:_ no Pages config so unclear whether the repo is published anywhere.
- **Use a bookmarklet:** Open any `.js` file under `bookmarklets/` or `downloaders/`, copy the entire `javascript:...` line, paste it into a new bookmark's URL field. Or drag a `[button]` from `index.html` onto your bookmarks bar.
- **Regenerate per-site downloaders:** `node downloaders/_generate.js` (Node 18+, zero deps).
- **Required env vars:** None. There is no `.env.example`.

## 3. Tech Stack
- **Language + runtime:** Vanilla JavaScript only. No transpiler. The generator runs on Node (any recent version — uses `fs`, `path`, `JSON`, no externals). _Not yet figured out:_ no `.nvmrc`, so Node version is unpinned.
- **Framework / key libraries:** None. Zero dependencies, zero lockfile.
- **What kind of project:** A grab-bag of standalone browser bookmarklets + a static showcase HTML page + a tiny Node generator. Not a library, not an app — a **toolkit repo**.
- **External services:** Each downloader bookmarklet opens a third-party download site (cobalt.tools, ssyoutube.com, snapinsta.app, fdown.net, ssstwitter.com, snaptik.app, redditsave.com, …). The bookmarklets only ever pass the current page URL — no API keys, no auth.

## 4. Code Map (The Important Files Only)
- `index.html` — Showcase web page. Hand-coded `<div class="tool-card">` per bookmarklet (NOT data-driven). Arch-Linux-themed dark UI, in-page search + category filter (`tools / i18n / privacy / design / search / system`). One file = HTML + CSS + tiny JS, no build. (`index.html:412`+ for cards, `index.html:610` for filter logic.)
- `bookmarklets/` — **Canonical drag-and-drop bookmarklet payloads.** 73 `.js` files split across 14 numbered category folders (`01-tips/` … `14-misc/`, plus `_references/` for URL launchers). Every file is a single-line `javascript:...` URL — paste straight into a bookmark.
- `downloaders/` — **One bookmarklet per social-media site.** 13 generated payloads (youtube, instagram, facebook, x-twitter, tiktok, reddit, pinterest, linkedin, vimeo, soundcloud, twitch, snapchat, universal). All emitted by `downloaders/_generate.js`.
- `downloaders/_generate.js` — **Single source of truth** for the per-site downloaders. A declarative `SITES` object + a long `JS_TEMPLATE` runtime string concatenated with a JSON config per site, written out as 13 standalone `.js` files. Edit one entry, run the script, get a new downloader.
- `src/` — **Readable, unminified sources** of the bigger bookmarklets — the development form. `src/force-copy.js` is the documented original of `bookmarklets/02-force-copy/force-copy.js`. The flat-named `src/tip.js`, `src/qr-code-interactive.js`, etc. are unencoded JS sources that correspond to URL-encoded payloads in `bookmarklets/`. `src/_wip/` is in-progress edits.
- `data/bookmarklets-data.js` — Structured `const bookmarkletsData = [...]` array (name + description + code per entry). Historical seed of a data-driven version of `index.html` that was never finished. Keep — useful for future refactor.
- `data/inventory.xlsx` — Owner's personal Excel inventory of bookmarklets. Don't open in Git tools, just leave it.
- `archive/` — **Immutable historical artifacts.** `bookmarks-export-2026-05-08.html` is the canonical browser-export the entire repo was rebuilt from. `index-prev.html` is the older showcase. `a11y-tools-mirror.html` is a 19MB third-party mirror (don't `cat` it casually). `archive/notes/` holds dev scratchpads.
- `README.md` — Public-facing usage doc. Long, marketing-toned.
- `CONTEXT.md` — This file. AI handoff doc.

## 5. Rules For Editing This Code
- **Zero dependencies. Period.** No `npm install`, no `package.json`. If a feature needs a library, find a way without it.
- **Vanilla JS only.** No TypeScript, no JSX, no bundler. Every `.js` file under `bookmarklets/` and `downloaders/` must be a valid `javascript:` URL — single line, starts with `javascript:`, runs in any modern browser.
- **One bookmarklet = one `.js` file.** New file extensions are `.js`. No `.ts`, no `.txt` for new bookmarklet code.
- **One canonical home per file.** No duplicates anywhere — the dedupe pass already happened (commit pre-restructure: c0b19ed → restructure commit). If you find yourself copying a file, move it instead.
- **Don't hand-edit `downloaders/<site>.js`.** Edit `downloaders/_generate.js` and regenerate. Hand-edits will be lost.
- **Single-line bookmarklets.** The generator strips newlines on emit. Keep that invariant.
- **Shadow DOM for any new modal UI** (see how the downloader template uses `attachShadow({mode:'closed'})`) — host page CSS will eat unprotected styles alive.
- **Sanitize URL display.** When echoing the page URL into HTML, escape `&` and `<` (the downloader template does `.replace(/&/g,"&amp;").replace(/</g,"&lt;")`). Don't skip this.
- **Strip tracking params** in any new "open URL elsewhere" flow (`utm_*`, `fbclid`, `igshid`, `si`, `t`, `ref_*`, …). Pattern is in `_generate.js` `clean()` helper.
- **Validate after generating.** `node --check` on every emitted file.
- **`src/` ↔ `bookmarklets/` are paired but not auto-built.** `src/foo.js` is the readable form; `bookmarklets/<cat>/foo.js` is the URL-encoded payload. There is **no current build script** linking them — edit both manually if you change one. (Future work: a small URL-encoder that emits `bookmarklets/` from `src/`.)

## 6. Fragile Bits & Landmines
- **`index.html` is hand-coded, not data-driven.** Tempting to wire it to `bookmarklets/` — that's a real refactor, every card is hardcoded (`index.html:412`+). `data/bookmarklets-data.js` is a half-finished seed for that effort.
- **`bookmarklets/06-downloader-legacy/` is intentional duplication.** Looks redundant next to `downloaders/` — it isn't. Pre-refactor backups, kept on purpose. Don't delete.
- **`bookmarklets/08-ocr/4.js` and `.../a.js`.** Yes, real filenames. Came from the bookmarks export with those names. Don't "fix" them.
- **`bookmarklets/02-force-copy/force-copy.js` was the hand-minified `force-copy.min.js`.** The readable source is `src/force-copy.js`. They are NOT auto-linked — both must be edited together.
- **Cross-origin autofill is best-effort.** `_generate.js` tries to populate the destination's input via `w.document.querySelector(...)` — same-origin policy will silently block this on most modern downloaders. Always copy URL to clipboard as a hard fallback (already done).
- **Third-party downloader services rot.** Sites in `_generate.js`' `SITES` go down, get bought, or start showing porn ads. Audit links every few months.
- **Bookmarklet length limits.** Some browsers cap bookmark URLs around 2KB-8KB. The downloader payloads (~7KB) sit on the edge. Watch out when adding services.
- **`archive/a11y-tools-mirror.html` is 19MB.** Don't `cat` it casually, don't index it. Third-party mirror, kept for reference.
- **`src/list-images.js` and a few others are themselves URL-encoded** (e.g. `%7B`, `%0A`). Treat them as already-baked payloads, not raw sources.
- **`data/inventory.xlsx` is a binary blob.** Git won't diff it usefully. Don't expect text tooling to work.

## 7. Current State
- **Last shipped (this PR, branch `claude/enhance-video-bookmarklet-Vhkfn`):**
  - Full repo restructure: every file moved to one canonical home, every duplicate deleted, every Windows `Zone.Identifier` artifact removed.
  - `extractor-scraper-downloader/` → `downloaders/` (cleaner name).
  - Root `force-copy.js` / `force-copy.min.js` → `src/force-copy.js` and `bookmarklets/02-force-copy/force-copy.js` respectively.
  - `list +++/` and `other/` directories dissolved — readable JS sources moved to `src/`, historical artifacts to `archive/`, scratch notes to `archive/notes/`.
  - `data.txt` (was `bookmarkletsData = [...]`) → `data/bookmarklets-data.js`. `data.xlsx` → `data/inventory.xlsx`.
  - Stale `GEMINI.md` deleted (its claims about `index.html` being data-driven were false — `CONTEXT.md` supersedes it).
  - `.gitignore` added.
- **Working on now:** Locking the new layout in via this PR.
- **Next up:**
  1. Decide whether to make `index.html` data-driven from `data/bookmarklets-data.js` or directly from the `bookmarklets/` tree.
  2. Build a small URL-encoder so `src/foo.js` ⇒ `bookmarklets/<cat>/foo.js` is a one-command rebuild.
  3. Audit third-party downloader URLs in `downloaders/_generate.js` (some rot every few months).

## 8. Update Protocol (Verbatim)
> **For the AI Assistant:** When asked to "Update CONTEXT.md":
> 1. Re-run Phase 0 — check for new `GEMINI.md` / `CLAUDE.md` / `.github/` files.
> 2. Re-scan the tree, manifests, and `.github/workflows/` for drift.
> 3. Read our recent conversation for new decisions, fragile bits discovered, or shifted goals.
> 4. Refresh the `_Last synced_` line with today's date and current commit SHA.
> 5. Rewrite — do not append. One clean source of truth. Preserve still-true content, revise the rest.
> 6. Keep §1 and §2 in plain English. Keep the file under ~350 lines.

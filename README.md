# Bookmarklets

A curated, deduplicated collection of one-click browser bookmarklets — tiny JavaScript snippets you drag onto your bookmarks bar to force-enable copy on locked pages, download social-media videos, pick colors, toggle dark mode, OCR text, edit pages, and more.

Zero dependencies. Zero build step. Open `index.html` in a browser, or paste a `.js` payload into a new bookmark.

---

## Repository layout

```
.
├── index.html                  # Showcase web page (Arch-Linux-themed dark UI)
│
├── bookmarklets/               # Drag-and-drop payloads, organized by category
│   ├── 01-tips/
│   ├── 02-force-copy/
│   ├── 03-translate/
│   ├── 04-qr-code/
│   ├── 05-edit-page/
│   ├── 06-downloader-legacy/   # pre-refactor backups of social downloaders
│   ├── 07-archive/             # save/search Wayback Machine
│   ├── 08-ocr/
│   ├── 09-privacy/             # clear cache, cookies, adblock
│   ├── 10-color-picker/
│   ├── 11-dark-mode/
│   ├── 12-extractor/           # links, images, emails, phone numbers
│   ├── 13-remove-media/
│   ├── 14-misc/                # screenshot, favicon, timer, quote, …
│   └── _references/            # URL-only reference launchers
│
├── downloaders/                # One bookmarklet per social-media site
│   ├── _generate.js            # declarative SITES config → 13 .js files
│   ├── youtube.js
│   ├── instagram.js
│   ├── facebook.js
│   ├── x-twitter.js
│   ├── tiktok.js
│   ├── reddit.js
│   ├── pinterest.js
│   ├── linkedin.js
│   ├── vimeo.js
│   ├── soundcloud.js
│   ├── twitch.js
│   ├── snapchat.js
│   └── universal.js
│
├── src/                        # Readable, unminified sources for the bigger bookmarklets
│   ├── force-copy.js
│   ├── tip.js
│   ├── translate-un-languages.js
│   ├── qr-code-interactive.js
│   ├── color-picker-original.js
│   ├── extractor-*.js
│   └── _wip/                   # work-in-progress edits
│
├── data/
│   ├── bookmarklets-data.js    # const bookmarkletsData = [...]
│   └── inventory.xlsx          # owner's personal inventory
│
├── archive/                    # Immutable historical artifacts
│   ├── bookmarks-export-2026-05-08.html   # canonical source the repo was rebuilt from
│   ├── index-prev.html                    # previous showcase page
│   ├── a11y-tools-mirror.html             # 19MB third-party mirror
│   └── notes/                             # dev scratchpads, project ideas
│
├── CONTEXT.md                  # AI handoff doc
├── README.md                   # This file
├── LICENSE                     # MIT
└── .gitignore
```

---

## Use a bookmarklet

**Drag and drop** — easiest path. Open `index.html` in a browser, drag the blue `[button]` for the bookmarklet you want onto your bookmarks bar.

**Or copy-paste** — open any `.js` file under `bookmarklets/` or `downloaders/`. The whole file is a single line starting with `javascript:`. Copy it, create a new bookmark, paste it into the URL field, save.

To run a bookmarklet, click it on any web page.

> **Tip:** Hide the bookmarks bar but want fast access? Press `Ctrl+L` (Windows/Linux) or `Cmd+L` (Mac), then type `@b` + `Tab` (Chrome/Edge) or `*` (Firefox) to search bookmarks from the address bar.

---

## Per-site downloaders (`downloaders/`)

One bookmarklet per platform. Click on a video page → modal lists curated downloaders → press `1`–`9` to pick one → URL is opened cleaned and copied to your clipboard.

| Site | File |
|---|---|
| YouTube | `downloaders/youtube.js` |
| Instagram | `downloaders/instagram.js` |
| Facebook | `downloaders/facebook.js` |
| X / Twitter | `downloaders/x-twitter.js` |
| TikTok | `downloaders/tiktok.js` |
| Reddit | `downloaders/reddit.js` |
| Pinterest | `downloaders/pinterest.js` |
| LinkedIn | `downloaders/linkedin.js` |
| Vimeo | `downloaders/vimeo.js` |
| SoundCloud | `downloaders/soundcloud.js` |
| Twitch | `downloaders/twitch.js` |
| Snapchat | `downloaders/snapchat.js` |
| **Universal** (any site) | `downloaders/universal.js` |

Each one:

- Strips tracking parameters (`utm_*`, `fbclid`, `igshid`, `si`, `ref_*`, …)
- Rewrites mobile/legacy hostnames (`m.facebook.com → www`, `twitter.com → x.com`)
- Extracts the bare video/post ID for services that need it
- Remembers the last service you picked per platform (localStorage)
- Always copies the cleaned URL to clipboard as a fallback
- Best-effort autofills the destination's input field
- Renders inside a Shadow-DOM modal so host-page CSS can't break it
- `1`–`9` to pick, `Enter` on focus, `Esc` to close

### Add a new site or service

Edit the `SITES` config in `downloaders/_generate.js`, then:

```bash
node downloaders/_generate.js
```

The 13 (or however many) `.js` files get rewritten in place.

---

## Bookmarklet backup (`bookmarklets/`)

73 standalone `.js` files split out of `archive/bookmarks-export-2026-05-08.html`, organized into 14 numbered category folders. Each file is one drag-and-drop-ready `javascript:` payload.

`_references/` and `_references-*.js` files inside categories are launcher bookmarklets that open a popup of curated reference URLs (third-party bookmarklet collections, source articles, etc.) — also stored as `.js` so the backup format stays uniform.

---

## Sources vs. payloads

- `src/foo.js` — readable JavaScript, easy to edit, with literal `<`, `>`, spaces.
- `bookmarklets/<category>/foo.js` — same logic, URL-encoded into a single-line `javascript:` payload that pastes cleanly into a bookmark URL field.

These are paired but **not auto-built today**. If you change one, edit both. (Future: a small URL-encoder script.)

---

## License

MIT. See [`LICENSE`](LICENSE).

---

## For AI assistants

Read [`CONTEXT.md`](CONTEXT.md) first. It's the canonical handoff doc — what this is, how to run it, what's load-bearing, what looks removable but isn't.

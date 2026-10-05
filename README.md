# Oktay Kırık — application pages

This public repository hosts privacy, terms, and support pages for applications
published by Oktay Kırık. Application source code, credentials, customer files,
and private support correspondence are not stored here.

## Published paths

| Application | Privacy                    | Terms                    | Support                    |
| ----------- | -------------------------- | ------------------------ | -------------------------- |
| Video Take  | `/video-take/privacy.html` | `/video-take/terms.html` | `/video-take/support.html` |
| Pado PDF    | `/pado-pdf/privacy.html`   | `/pado-pdf/terms.html`   | `/pado-pdf/support.html`   |
| Floe        | `/floe/privacy.html`       | `/floe/terms.html`       | `/floe/support.html`       |

The site is published at <https://oktykrk.github.io/>. Add future applications
as another top-level directory instead of creating a separate repository.

Legacy Video Take URLs under `/video-take-site/`, `/privacy.html`, and
`/support.html` are retained as redirects.

## Landing pages

The portfolio at `/` uses a warm editorial theme in `portfolio.css`. Floe at
`/floe/` has an independent white, ink, and cobalt design in `floe/floe.css`.
Other app pages and the shared legal-page stylesheet are independent.

`floe/floe.js` powers a single interactive desktop illustration with Focus,
Split, and Columns layouts, a Snap Bar / Snap Assist sequence, and a draggable
shared-resize demo. The sequence loops while visible, with a two-second hold on
the finished layout. It supports pause and resume, and pauses offscreen or in
background tabs. Reduced motion uses explicit step controls. There are no
third-party runtime scripts or external font loads.
The scenes are product illustrations, not recordings of the installed app.
Photo attribution is in `floe/media/README.md`.

Run a local preview with `python3 -m http.server 8765`. Verify links and image
references with `python3 tools/check-site.py`. Rebuild the 1200×630 social images
on macOS with `swift tools/render-social.swift`; pass `floe` to update only Floe.

Floe offers a public 7-day trial download from the latest stable, notarized
GitHub Release via `releases/latest/download/Floe.dmg`. Every new release must
include this byte-identical alias of its versioned DMG. Release-note and checksum
links also use `latest`; omit fixed version/size metadata so normal releases do
not require a website update. `SHA256SUMS.txt` names the versioned DMG; its hash
also verifies the identical `Floe.dmg` download. Purchasing and license activation are unavailable while Lemon
Squeezy approval is pending; the page explains that window management pauses
after the trial. Never link a test checkout as a live sale. Add a verified live
checkout only after merchant approval and a new release configured for the live
catalog. Keep billing on Lemon Squeezy and binaries on GitHub Releases; this
repository contains neither merchant credentials nor the private app source.

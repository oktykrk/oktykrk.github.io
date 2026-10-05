# Oktay Kırık — application pages

This public repository hosts privacy, terms, and support pages for applications
published by Oktay Kırık. Application source code, credentials, customer files,
and private support correspondence are not stored here.

## Published paths

| Application | Privacy | Terms | Support |
|---|---|---|---|
| Video Take | `/video-take/privacy.html` | `/video-take/terms.html` | `/video-take/support.html` |
| Pado PDF | `/pado-pdf/privacy.html` | `/pado-pdf/terms.html` | `/pado-pdf/support.html` |
| Floe | `/floe/privacy.html` | `/floe/terms.html` | `/floe/support.html` |

The site is published at <https://oktykrk.github.io/>. Add future applications
as another top-level directory instead of creating a separate repository.

Legacy Video Take URLs under `/video-take-site/`, `/privacy.html`, and
`/support.html` are retained as redirects.

## Landing pages

The portfolio at `/` uses a warm editorial theme in `portfolio.css`. Floe at
`/floe/` has a separate blue workspace theme in `floe/floe.css` and an accessible
layout illustration in `floe/floe.js`. Other app pages and the shared legal-page
stylesheet are independent of these two designs.

`floe/motion.css` and `floe/motion.js` provide three animated product
illustrations: top-edge Snap Bar placement, interactive Snap Assist filling,
and display-shaped previews for laptop, ultrawide, and portrait monitors.
Each demo plays once when it becomes visible and can be paused or replayed.
Offscreen/background demos stop; reduced motion uses explicit step controls.
The scenes are illustrations, not recordings of the installed application.

Run a local preview with `python3 -m http.server 8765`. Verify links and image
references with `python3 tools/check-site.py`. Rebuild the original 1200×630
social images on macOS with `swift tools/render-social.swift`.

Floe offers a public 7-day trial download from the verified, notarized `v1.0`
GitHub Release. Purchasing and license activation are unavailable while Lemon
Squeezy approval is pending; the page explains that window management pauses
after the trial. Never link a test checkout as a live sale. Add a verified live
checkout only after merchant approval and a new release configured for the live
catalog. Keep billing on Lemon Squeezy and binaries on GitHub Releases; this
repository contains neither merchant credentials nor the private app source.

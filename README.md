# Oktay Kırık — application pages

This public repository hosts privacy, terms, and support pages for applications
published by Oktay Kırık. Application source code, credentials, customer files,
and private support correspondence are not stored here.

## Published paths

| Application | Privacy                    | Terms                    | Support                    |
| ----------- | -------------------------- | ------------------------ | -------------------------- |
| Cadreur  | `/video-take/privacy.html` | `/video-take/terms.html` | `/video-take/support.html` |
| Pado PDF    | `/pado-pdf/privacy.html`   | `/pado-pdf/terms.html`   | `/pado-pdf/support.html`   |
| Floe        | `/floe/privacy.html`       | `/floe/terms.html`       | `/floe/support.html`       |

The site is published at <https://oktykrk.github.io/>. Add future applications
as another top-level directory instead of creating a separate repository.

Legacy Cadreur URLs under `/video-take-site/`, `/privacy.html`, and
`/support.html` are retained as redirects.

## Landing pages

The portfolio at `/` uses a charcoal and lime design, oversized Space Grotesk
typography, and three interactive app showcases in `portfolio.css` and
`portfolio.js`. Floe at `/floe/` has an independent white, ink, and cobalt design
in `floe/floe.css`. Cadreur retains its own paper and lavender identity. Product
pages and the shared legal-page stylesheet are independent of the portfolio.

Portfolio previews are manual: Floe illustrates three window layouts, while
Cadreur and Pado PDF switch between real app screenshots. Buttons expose their
selected state and support native keyboard interaction. Reduced motion disables
transitions; content and links work without JavaScript. The three-tile hero motif
unfolds once on load and aligns on hover. Reduced motion keeps the motif static.
The font is self-hosted with its SIL Open Font License under `assets/fonts/`.
Asset provenance and verified profile links are recorded in
`assets/portfolio/README.md`.

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

## Search indexing

Floe's title, description, feature headings, and portfolio link describe it as
a Mac window manager for snapping, tiling, and shared resizing. The product and
installation help are static HTML and remain readable without JavaScript.
Illustration text uses paragraphs instead of document headings and is excluded
from search snippets with `data-nosnippet`.

Keep `https://oktykrk.github.io/floe/` as the canonical landing URL, including
when the page is reached through `/floe/index.html`. `robots.txt` allows crawlers
and advertises `sitemap.xml`; the sitemap contains only canonical content pages.
Update a page's `lastmod` when its content, metadata, structured data, or links
change significantly. Do not reset unchanged pages' dates during deployment.
`tools/check-site.py` checks local links, crawler access, sitemap/canonical
consistency, page metadata, and JSON-LD syntax.

The JSON-LD connects the product page to Floe's actual features, requirements,
download, support, license terms, and author. Purchasing is pending and there
are no published customer ratings, so do not invent offers or ratings to pass
Google's software-app rich-result requirements. Schema validity and eligibility
for a Google rich result are separate checks.

After publishing, verify the `https://oktykrk.github.io/` URL-prefix property in
[Google Search Console](https://search.google.com/search-console/). A
`github.io` property can use an HTML verification file or meta tag supplied by
Google; this repository has no verification token. Submit
`https://oktykrk.github.io/sitemap.xml`, inspect the Floe landing and support
URLs, run a live URL test, and request indexing. The Page indexing report shows
Google's actual index status; a `site:` search alone is not a definitive test.
Indexing and rankings remain search-engine decisions.

References: [Google's title guidance](https://developers.google.com/search/docs/appearance/title-link),
[snippet guidance](https://developers.google.com/search/docs/appearance/snippet),
[sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
and [software-app structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app).

## AI search discovery

The existing `User-agent: *` / `Allow: /` policy permits `OAI-SearchBot`,
`ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`, and `Claude-User`.
`tools/check-site.py` checks these agents alongside Googlebot and Bingbot so a
future robots.txt change does not accidentally block the public content.
A request with a bot's user-agent name checks ordinary HTTP access; it does
not prove that requests from the provider's actual IP ranges will succeed or
that the provider has crawled, indexed, cited, or recommended Floe.

`/llms.txt` indexes the site's application pages. `/floe/llms.txt` gives a short
Floe overview with use cases, features, requirements, permissions, limitations,
the current trial and planned purchase conditions, and official links.
Portfolio and Floe pages advertise the relevant file with `rel="describedby"`.
Keep this summary consistent with the visible pages when product, licensing,
or distribution details change. Neither file belongs in the HTML sitemap.

These context files follow the optional [llms.txt proposal](https://llmstxt.org/).
They are an additional reading aid, not a documented requirement for ChatGPT
Search or a guaranteed ranking signal. The indexed HTML, useful visible
answers, and accurate product information remain the primary content.
[OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots)
distinguishes search access (`OAI-SearchBot`) from model-training collection
(`GPTBot`); permitting training is not a way to guarantee recommendations.
[Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features)
also requires no special AI files or schema beyond its existing SEO practices.

## Floe distribution

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

## Cadreur landing page

`/video-take/` is Cadreur's product website. It keeps the established URL and
existing privacy, terms, support, and legacy redirects. `cadreur.css` provides
its independent warm-paper, ink, and lavender design. No build step, external
fonts, analytics, or third-party runtime packages are needed.

`cadreur.js` animates the illustrated teleprompter and provides an accessible
four-step walkthrough using actual app screenshots. The preview can be paused,
stops while offscreen or in a background tab, and starts paused with reduced
motion enabled. The walkthrough supports arrow keys, Home, and End. Content
and download links remain available with JavaScript disabled.

The EN/TR switch translates copy and accessibility descriptions and chooses the
matching app screenshots. It follows the browser language on a first visit and
stores only an explicit language preference locally. English is the static HTML
fallback. Translations live in `video-take/translations.js`.

The App Store link uses the verified, name-independent app ID `6817267046`.
At implementation, the live listing still used the former name Video Take while
the Cadreur rename was awaiting review. All download buttons point to this same
existing app, without assuming the review outcome.

The two original editorial photographs were created with built-in ImageGen.
Exact prompts and media provenance are in `video-take/media/README.md`. App
screens show real UI with sample content; the hero is an animated illustration.

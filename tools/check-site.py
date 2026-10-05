"""Verify local links and search-indexing signals without external services."""
import json
import re
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree

root = Path(__file__).resolve().parent.parent
origin = 'https://oktykrk.github.io'
sitemap_url = f'{origin}/sitemap.xml'
namespace = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
crawler_agents = ('Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User',
                  'PerplexityBot', 'Claude-SearchBot', 'Claude-User')
context_files = (root / 'llms.txt', root / 'floe' / 'llms.txt')

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.references = set(), []
        self.duplicate_ids, self.canonicals, self.json_ld = [], [], []
        self.metadata, self.title_parts = {}, []
        self.lang, self.title_count, self.redirect = '', 0, False
        self.in_title, self.in_json_ld = False, False
        self.json_ld_parts = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.duplicate_ids.append(attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'html':
            self.lang = attrs.get('lang', '')
        elif tag == 'title':
            self.title_count += 1
            self.in_title = True
        elif tag == 'meta':
            key = (attrs.get('name') or attrs.get('property') or '').lower()
            self.metadata.setdefault(key, []).append(attrs.get('content', ''))
            if attrs.get('http-equiv', '').lower() == 'refresh':
                self.redirect = True
        elif tag == 'link' and 'canonical' in attrs.get('rel', '').split():
            self.canonicals.append(attrs.get('href', ''))
        elif tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_json_ld = True
            self.json_ld_parts = []
        for key in ('href', 'src'):
            if attrs.get(key):
                self.references.append(attrs[key])
        if tag == 'meta' and (attrs.get('property') or attrs.get('name')) in ('og:image', 'twitter:image'):
            self.references.append(attrs.get('content', ''))
    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)
        if self.in_json_ld:
            self.json_ld_parts.append(data)
    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'script' and self.in_json_ld:
            self.json_ld.append(''.join(self.json_ld_parts))
            self.in_json_ld = False

    @property
    def noindex(self):
        directives = ' '.join(self.metadata.get('robots', []) + self.metadata.get('googlebot', []))
        return bool({'noindex', 'none'} & set(directives.lower().replace(',', ' ').split()))

def local_target(reference, source):
    url = urlsplit(reference)
    if url.scheme or url.netloc:
        if url.netloc != urlsplit(origin).netloc:
            return None
        target = root / unquote(url.path).lstrip('/')
    elif not url.path:
        target = source
    else:
        target = root / unquote(url.path).lstrip('/') if url.path.startswith('/') else source.parent / unquote(url.path)
    if target.is_dir():
        target /= 'index.html'
    return target.resolve()

def page_url(path):
    relative = path.relative_to(root).as_posix()
    if path.name == 'index.html':
        relative = relative[:-len('index.html')]
    return f'{origin}/{relative}'

pages = {path: Page(path.read_text(encoding='utf-8')) for path in root.rglob('*.html') if '.git' not in path.parts}
errors = []
count = 0
robots = RobotFileParser()
robots.parse((root / 'robots.txt').read_text(encoding='utf-8').splitlines())
if sitemap_url not in (robots.site_maps() or []):
    errors.append('robots.txt: missing canonical sitemap declaration')

def check_crawler_access(url, label):
    for agent in crawler_agents:
        if not robots.can_fetch(agent, url):
            errors.append(f'{label}: robots.txt blocks {agent}')

for path, page in pages.items():
    label = path.relative_to(root)
    for duplicate in page.duplicate_ids:
        errors.append(f'{label}: duplicate id {duplicate}')
    for block in page.json_ld:
        try:
            value = json.loads(block)
            if not isinstance(value, (dict, list)):
                errors.append(f'{label}: JSON-LD must be an object or array')
        except json.JSONDecodeError as error:
            errors.append(f'{label}: invalid JSON-LD: {error}')
    for reference in page.references:
        url = urlsplit(reference)
        target = local_target(reference, path)
        if target is None:
            continue
        count += 1
        if not target.exists():
            errors.append(f'{label}: missing {reference}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{label}: missing anchor {reference}')
        if target.is_relative_to(root):
            check_crawler_access(f'{origin}/{target.relative_to(root).as_posix()}', f'{label}: {reference}')

for path in context_files:
    label = path.relative_to(root)
    if not path.exists():
        errors.append(f'{label}: missing AI context file')
        continue
    source = path.read_text(encoding='utf-8')
    if not source.startswith('# '):
        errors.append(f'{label}: missing project heading')
    check_crawler_access(page_url(path), str(label))
    for reference in re.findall(r'\[[^\]]+\]\(([^)\s]+)\)', source):
        target = local_target(reference, path)
        if target is None:
            continue
        count += 1
        if not target.exists():
            errors.append(f'{label}: missing {reference}')
        elif urlsplit(reference).fragment and target in pages:
            if unquote(urlsplit(reference).fragment) not in pages[target].ids:
                errors.append(f'{label}: missing anchor {reference}')
        check_crawler_access(reference, f'{label}: {reference}')

sitemap = ElementTree.parse(root / 'sitemap.xml').getroot()
if sitemap.tag != f'{{{namespace["sm"]}}}urlset':
    errors.append('sitemap.xml: invalid urlset namespace')
sitemap_locations = []
for entry in sitemap.findall('sm:url', namespace):
    locations = entry.findall('sm:loc', namespace)
    if len(locations) != 1 or not locations[0].text:
        errors.append('sitemap.xml: each entry must have exactly one loc')
        continue
    location = locations[0].text.strip()
    sitemap_locations.append(location)
    parsed = urlsplit(location)
    if f'{parsed.scheme}://{parsed.netloc}' != origin or parsed.query or parsed.fragment:
        errors.append(f'sitemap.xml: noncanonical URL {location}')
    target = local_target(location, root / 'index.html')
    if target not in pages:
        errors.append(f'sitemap.xml: missing HTML page {location}')
    elif (pages[target].canonicals and pages[target].canonicals != [location]) or pages[target].noindex or pages[target].redirect:
        errors.append(f'sitemap.xml: {location} must be indexable and self-canonical')
    elif page_url(target) != location:
        errors.append(f'sitemap.xml: {location} must use the preferred page path')
    check_crawler_access(location, f'sitemap.xml: {location}')
    lastmod = entry.find('sm:lastmod', namespace)
    if lastmod is not None:
        try:
            modified = datetime.fromisoformat((lastmod.text or '').replace('Z', '+00:00'))
            if modified.date() > datetime.now().astimezone().date():
                errors.append(f'sitemap.xml: future lastmod for {location}')
        except ValueError:
            errors.append(f'sitemap.xml: invalid lastmod for {location}')
if len(set(sitemap_locations)) != len(sitemap_locations):
    errors.append('sitemap.xml: duplicate URLs')

indexable = {path: page for path, page in pages.items() if not page.redirect and not page.noindex and path.name != '404.html'}
canonical_owners = {}
for path, page in indexable.items():
    label = path.relative_to(root)
    if not page.lang:
        errors.append(f'{label}: missing document language')
    if page.title_count != 1 or not ''.join(page.title_parts).strip():
        errors.append(f'{label}: needs exactly one nonempty title')
    descriptions = page.metadata.get('description', [])
    if len(descriptions) != 1 or not descriptions[0].strip():
        errors.append(f'{label}: needs exactly one nonempty meta description')
    # Canonical tags are optional; the sitemap can declare a preferred URL.
    # The portfolio and Floe have explicit canonicals that must stay present.
    needs_canonical = path == root / 'index.html' or path.is_relative_to(root / 'floe')
    if len(page.canonicals) > 1 or (needs_canonical and not page.canonicals):
        errors.append(f'{label}: needs exactly one canonical URL')
        continue
    canonical = page.canonicals[0] if page.canonicals else page_url(path)
    if canonical not in sitemap_locations:
        errors.append(f'{label}: canonical URL missing from sitemap')
    if canonical in canonical_owners:
        errors.append(f'{label}: canonical URL also used by {canonical_owners[canonical]}')
    canonical_owners[canonical] = label

if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(pages)} HTML pages, {len(context_files)} AI context files, {count} local references, {len(sitemap_locations)} indexable sitemap URLs; links, metadata, JSON-LD, canonicals, and access for {len(crawler_agents)} crawler agents verified.')

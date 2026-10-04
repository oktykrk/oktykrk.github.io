"""Verify local navigation and assets without contacting external services."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.references = set(), []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if attrs.get(key):
                self.references.append(attrs[key])
        if tag == 'meta' and attrs.get('property') == 'og:image':
            self.references.append(attrs.get('content', ''))

pages = {path: Page(path.read_text()) for path in root.rglob('*.html') if '.git' not in path.parts}
errors = []
count = 0
for path, page in pages.items():
    for reference in page.references:
        url = urlsplit(reference)
        if url.scheme or url.netloc:
            if url.netloc != 'oktykrk.github.io':
                continue
            target = root / unquote(url.path).lstrip('/')
        elif not url.path:
            target = path
        else:
            target = root / unquote(url.path).lstrip('/') if url.path.startswith('/') else path.parent / unquote(url.path)
        if target.is_dir():
            target /= 'index.html'
        count += 1
        if not target.exists():
            errors.append(f'{path.relative_to(root)}: missing {reference}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{path.relative_to(root)}: missing anchor {reference}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(pages)} HTML pages, {count} local references, no missing files or anchors.')

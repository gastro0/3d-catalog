"""Common HTTP access and HTML parsing for Page Objects."""

from html.parser import HTMLParser
from urllib.request import urlopen

from tests.config import BASE_URL, REQUEST_TIMEOUT_SECONDS


class _HTMLDocument(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = set()
        self.search_labels = set()
        self.has_heading = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            self.links.add(attrs.get("href", ""))
        elif tag == "input" and attrs.get("type") == "search":
            self.search_labels.add(attrs.get("aria-label", ""))
        elif tag == "h1":
            self.has_heading = True


class BasePage:
    path = "/"

    def __init__(self):
        self.status_code = None
        self.content_type = ""
        self._document = _HTMLDocument()

    def open(self):
        with urlopen(BASE_URL + self.path, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            self.status_code = response.status
            self.content_type = response.headers.get_content_type()
            self._document = _HTMLDocument()
            self._document.feed(response.read().decode("utf-8"))
        return self

    def has_heading(self):
        return self._document.has_heading

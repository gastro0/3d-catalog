"""Page Object for the categories page."""

from tests.pages.base_page import BasePage


class CategoriesPage(BasePage):
    path = "/categories"

    @property
    def category_links(self):
        return {
            link for link in self._document.links
            if link.startswith("/categories/")
        }

    def has_category(self, slug):
        return f"/categories/{slug}" in self.category_links

    def has_search(self):
        return bool(
            self._document.search_labels & {"Поиск категории", "Search categories"}
        )

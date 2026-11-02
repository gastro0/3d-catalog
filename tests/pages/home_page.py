"""Page Object for the home page."""

from tests.pages.base_page import BasePage


class HomePage(BasePage):
    path = "/"

    def has_catalog_navigation(self):
        return {"/categories", "/favorites"} <= self._document.links

    def has_search(self):
        return bool(self._document.search_labels & {"Поиск моделей", "Search models"})

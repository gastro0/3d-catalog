"""Site smoke tests using pytest and Page Objects."""


def test_home_page_has_navigation_and_search(home_page):
    assert home_page.status_code == 200
    assert home_page.content_type == "text/html"
    assert home_page.has_heading(), "Page should have an h1 heading"
    assert home_page.has_catalog_navigation(), "Catalog navigation is missing"
    assert home_page.has_search(), "Catalog search is missing"


def test_categories_page_lists_all_categories(categories_page):
    assert categories_page.status_code == 200
    assert categories_page.content_type == "text/html"
    assert categories_page.has_heading(), "Page should have an h1 heading"
    assert len(categories_page.category_links) == 19
    assert categories_page.has_category("home")
    assert categories_page.has_category("tools")
    assert categories_page.has_search(), "Category search is missing"

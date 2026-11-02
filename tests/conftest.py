"""Fixtures shared by the site tests."""

import pytest

from tests.pages.categories_page import CategoriesPage
from tests.pages.home_page import HomePage


@pytest.fixture
def home_page():
    return HomePage().open()


@pytest.fixture
def categories_page():
    return CategoriesPage().open()

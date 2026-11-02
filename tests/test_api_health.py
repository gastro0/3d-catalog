"""API smoke test for GET /health; no authentication required."""

import json
from urllib.request import urlopen

from tests.config import API_BASE_URL, REQUEST_TIMEOUT_SECONDS


def test_get_health_returns_ok():
    with urlopen(
        API_BASE_URL + "/health", timeout=REQUEST_TIMEOUT_SECONDS
    ) as response:
        assert response.status == 200
        assert response.headers.get_content_type() == "application/json"
        payload = json.load(response)

    assert isinstance(payload, dict)
    assert payload.get("status") == "ok"
    assert isinstance(payload.get("storageConfigured"), bool)

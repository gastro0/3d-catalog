"""Shared configuration for HTTP tests."""

import os

BASE_URL = os.environ.get("SITE_URL", "http://127.0.0.1:3000").rstrip("/")
API_BASE_URL = os.environ.get("API_URL", "http://127.0.0.1:7777").rstrip("/")
REQUEST_TIMEOUT_SECONDS = 60

#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:${PORT:-8080}}"
API_KEY="${API_KEY:-}"

echo "Health..."
curl -sS "$BASE_URL/health" | cat
echo

if [ -n "$API_KEY" ]; then
  echo "Payments (auth)..."
  curl -sS -H "x-api-key: $API_KEY" "$BASE_URL/payments" | cat
  echo
else
  echo "API_KEY not set; skipping auth checks."
fi

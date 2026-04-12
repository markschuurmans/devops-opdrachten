#!/bin/sh
set -eu

cat > /app/public/config.js <<EOF
window.__env = window.__env || {};
window.__env.apiBaseUrl = "${API_BASE_URL:-http://localhost:3005}";
EOF

exec "$@"


#!/bin/sh
set -eu

cat > /usr/share/nginx/html/config.js <<EOF
window.__env = window.__env || {};
window.__env.apiBaseUrl = "${API_BASE_URL:-/api}";
EOF


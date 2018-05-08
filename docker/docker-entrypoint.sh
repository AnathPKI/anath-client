#!/bin/sh
#
# Adjust the angular constant 'AS_BACKEND_BASE_URL' in app.js. After that, execute whatever has been passed on
# the command line.

set -eu

BACKEND_URL=${BACKEND_URL:-http://localhost:8080/}

sed \
 -i \
 -e "s;\('AS_BACKEND_BASE_URL':[[:space:]]*\)'http://localhost:8080/';\1'$BACKEND_URL';" \
 /usr/share/nginx/html/app.js

exec "$@"
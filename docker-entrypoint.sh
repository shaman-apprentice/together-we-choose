#!/bin/sh
set -e

cd /usr/src/app/backend
set -a
. .env
set +a
npx typeorm migration:run -d dist/database/data-source.js

cd /usr/src/app
exec "$@"

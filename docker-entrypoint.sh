#!/bin/sh
set -e

cd /usr/src/app/backend

# Load .env file but don't override existing environment variables
while IFS='=' read -r key value; do
	# Skip comments and empty lines
	case "$key" in
		''|'#'*) continue ;;
	esac
	# Only set if not already set
	if [ -z "$(eval echo \$$key)" ]; then
		export "$key=$value"
	fi
done < .env

npx typeorm migration:run -d dist/database/data-source.js

cd /usr/src/app
exec "$@"

FROM node:24-alpine AS frontend-build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY frontend ./frontend
RUN npm ci --workspace=shared --workspace=frontend
RUN npm run build --workspace=shared
RUN npm run build --workspace=frontend

FROM node:24-alpine AS backend-build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY backend ./backend
RUN npm ci --workspace=shared --workspace=backend
RUN npm run build --workspace=shared
RUN npm run build --workspace=backend
RUN npm ci --omit=dev --workspace=shared --workspace=backend

FROM node:24-alpine
RUN apk add --no-cache python3 make g++ sqlite-dev
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/storage/sqlite /usr/src/app/storage/images
COPY --from=backend-build /usr/src/app/node_modules ./node_modules
COPY package.json .
COPY shared/package.json ./shared/package.json
COPY backend/.env ./backend/.env
COPY backend/package.json ./backend/package.json
COPY --from=backend-build /usr/src/app/backend/dist ./backend/dist
COPY --from=backend-build /usr/src/app/shared/dist ./shared/dist
COPY --from=frontend-build /usr/src/app/frontend/dist/frontend/browser /tmp/frontend
RUN set -e; \
	PATH_TO_FRONTEND=$(grep '^PATH_TO_FRONTEND=' ./backend/.env | cut -d '=' -f2- | tr -d '\r'); \
	if [ -z "$PATH_TO_FRONTEND" ]; then \
		echo "PATH_TO_FRONTEND not set in .env" >&2; \
		exit 1; \
	fi; \
	mkdir -p "$PATH_TO_FRONTEND"; \
	cp -r /tmp/frontend/. "$PATH_TO_FRONTEND"; \
	rm -rf /tmp/frontend
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
USER node
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod", "--workspace=backend"]

#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST=${REMOTE_HOST:-"88.99.121.53"}
REMOTE_USER=${REMOTE_USER:-"root"}
IMAGE_NAME=${IMAGE_NAME:-"together-we-choose"}
CONTAINER_NAME=${CONTAINER_NAME:-"together-we-choose"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

echo "Deploy to ${REMOTE_HOST}"

echo "Building Docker image ${IMAGE_NAME}:${IMAGE_TAG}"
docker build --pull --tag "${IMAGE_NAME}:${IMAGE_TAG}" .

echo "Publishing image to ${REMOTE_USER}@${REMOTE_HOST}"
docker save "${IMAGE_NAME}:${IMAGE_TAG}" \
	| gzip -c \
	| ssh "${REMOTE_USER}@${REMOTE_HOST}" 'gunzip | docker load'

echo "Restarting remote container ${CONTAINER_NAME}"
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<EOF
set -euo pipefail
if docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
	docker rm -f "${CONTAINER_NAME}"
fi

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -p 3000:3000 \
	-v /var/lib/together-we-choose/storage/sqlite:/usr/src/app/storage/sqlite \
	-v /var/lib/together-we-choose/storage/images:/usr/src/app/storage/images \
  "${IMAGE_NAME}:${IMAGE_TAG}"

docker system prune -f
EOF
echo "Restarted new docker image and pruned old docker images."

echo "Deployment complete."

# local development image: next dev with sources mounted from the host (see docker-compose.yml)
# debian, not alpine: sharp and next swc ship prebuilt glibc binaries for both amd64 and arm64
FROM node:16-bullseye

# Create app directory
WORKDIR /home

# install dependencies
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY frontend/package.json ./frontend/package.json

COPY packages/api-schemas/package.json ./packages/api-schemas/package.json
COPY packages/models-types/package.json ./packages/models-types/package.json
COPY packages/helpers/package.json ./packages/helpers/package.json
COPY packages/routing/package.json ./packages/routing/package.json
COPY packages/i18n/package.json ./packages/i18n/package.json

# yarn 1 workspaces linking fails randomly (ENOENT lstat), same retries as gitlab/deps/Dockerfile
RUN yarn install || yarn install || yarn install

# run app
CMD [ "yarn", "frontend", "run", "dev" ]

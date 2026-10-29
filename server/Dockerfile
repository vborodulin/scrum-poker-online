FROM node:16-alpine3.11

# Create app directory
WORKDIR /home

# install dependencies
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY server/package.json ./server/package.json

COPY packages/api-schemas/package.json ./packages/api-schemas/package.json
COPY packages/models-types/package.json ./packages/models-types/package.json
COPY packages/helpers/package.json ./packages/helpers/package.json
COPY packages/routing/package.json ./packages/routing/package.json
COPY packages/i18n/package.json ./packages/i18n/package.json

RUN yarn install || yarn install

# run app
CMD [ "yarn", "server:demon" ]

# syntax=docker/dockerfile:1.17
# Portal UI dependencies
FROM node:22-alpine AS portal-ui-deps

WORKDIR /app
# corepack (Yarn Berry) needs root; then drop to the non-root `node` user
# before installing/building any untrusted dependencies.
RUN corepack enable && chown node:node /app
USER node

COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all --production

# Portal UI build
FROM node:22-alpine AS portal-ui-builder

WORKDIR /app
RUN corepack enable && chown node:node /app
USER node

COPY --from=portal-ui-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

FROM scratch AS portal-ui-export

COPY --from=portal-ui-builder /app/dist dist
COPY --from=portal-ui-deps /app/yarn.lock .

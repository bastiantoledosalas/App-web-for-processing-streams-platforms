#Building a bundle in a Docker container
#Docker base image node 18 slim, contains the minimal packages needed to run node
FROM node:18-slim AS base

#Set environment variables
ENV PNPM_HOME="/pnpm"

# PATH=/pnpm:/pnpm:/pnpm
ENV PATH="$PNPM_HOME:$PATH"

#Execute builds commands 
RUN corepack enable
COPY . /app

#Change WORKDIR to /app
WORKDIR /app

#Production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

RUN rm /app/dist/src/Contexts/Mooc/Shared/infrastructure/config/production.json
RUN rm /app/src/Contexts/Mooc/Shared/infrastructure/config/production.json
COPY --from=build /app/docker/conf/production.json /app/dist/src/Contexts/Mooc/Shared/infrastructure/config/production.json
COPY --from=build /app/docker/conf/production.json /app/src/Contexts/Mooc/Shared/infrastructure/config/production.json

#Expose the port 5000 as listening on.
EXPOSE 5000

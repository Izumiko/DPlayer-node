FROM oven/bun:alpine as base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY . /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile && bun run build

FROM base AS release
COPY --from=install /temp/dev/dist/ .

EXPOSE 1207/tcp

VOLUME /usr/src/app/logs

ENTRYPOINT ["bun", "run", "index.js"]

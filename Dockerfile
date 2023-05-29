FROM node:14-buster-slim AS base-image
RUN apt-get update && apt-get -y upgrade && apt-get -y install curl && apt-get -y autoremove && apt-get clean

ENV USER_NAME microservice
ENV APP_HOME /opt/$USER_NAME
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

FROM base-image AS npmrc-creator

ARG NPM_TOKEN
ARG NPMRC

COPY [".npmrc_build", "./.npmrc_build"]
COPY [".npmrc", "./.npmrc"]
COPY ["construct-npmrc.js", "./construct-npmrc.js"]

RUN bash -c "$(node construct-npmrc)"

FROM base-image AS production-dependencies

COPY --from=npmrc-creator $APP_HOME/.npmrc ./.npmrc
RUN true
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --production

FROM production-dependencies AS dev-dependencies

COPY --from=npmrc-creator $APP_HOME/.npmrc ./.npmrc
RUN true
COPY ["tsconfig.json", "tsconfig.build.json", "./"]
RUN npm ci

FROM dev-dependencies AS gambiarra

COPY --from=dev-dependencies $APP_HOME/node_modules/@aura/config-lib/mocks/server.js ./server.js
# RUN npm i json-server
CMD ["node", "server.js"]

FROM dev-dependencies AS code

COPY ["src", "./src/"]

FROM code AS unit-tests

COPY ["tests/fixtures", "./tests/fixtures/"]
CMD npm run test:unit:npm && npm run test:unit:chown

FROM code AS builder

RUN npm run build

FROM node:14-alpine AS fargate

RUN apk add --update curl
ENV USER_NAME microservice
ENV APP_HOME /opt/$USER_NAME
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

ENV ELASTIC_APM_SERVER_URL 'https://0a45548b388140afad378bed5b3c4c21.apm.eastus.azure.elastic-cloud.com:443'
ENV ELASTIC_APM_SECRET_TOKEN 'QxQf5X5Y4BURvlw31q'
ENV ELASTIC_APM_SERVICE_NAME 'sava-fargate-singular-svc'
ENV ELASTIC_APM_SERVICE_VERSION 'fargate'

COPY ["elastic-apm-node.js", "package.json", "package-lock.json", "./"]
RUN true
COPY ["package.json", "package-lock.json", "config*.yml", "./"]
RUN true
COPY --from=production-dependencies $APP_HOME/node_modules ./node_modules
RUN true
COPY --from=builder $APP_HOME/dist ./dist

# HEALTHCHECK --interval=10s --timeout=2s --start-period=5s \
#     CMD curl --fail http://localhost:3000/health -H 'x-trace-id: healthcheck' || exit 1
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]

FROM base-image AS component-test-runner

COPY ["tests/component/package.json", "tests/component/package-lock.json", "./tests/component/"]
WORKDIR $APP_HOME/tests/component
RUN npm ci

COPY --from=dev-dependencies $APP_HOME/node_modules ../../node_modules
RUN true
COPY --from=builder $APP_HOME/src ../../src
RUN true
COPY ["tests/fixtures", "../fixtures/"]
RUN true
COPY ["tests/component/src", "./src/"]

CMD ["tail", "-f", "/dev/null"]

FROM node:14.21.1

ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD

ARG POSTGRES_HOST
ENV POSTGRES_HOST=$POSTGRES_HOST

ARG ALLOWED_ORIGINS
ENV ALLOWED_ORIGINS=$ALLOWED_ORIGINS

ARG FORCE_DB_RESET
ENV FORCE_DB_RESET=$FORCE_DB_RESET

ARG INITIAL_CRON_WAIT
ENV INITIAL_CRON_WAIT=$INITIAL_CRON_WAIT

ARG ICOS_INTEGRATION_SCHEDULE
ENV ICOS_INTEGRATION_SCHEDULE=$ICOS_INTEGRATION_SCHEDULE


WORKDIR /app
COPY . .

RUN npm ci --only=production

EXPOSE 3000

CMD \
  POSTGRES_HOST=$POSTGRES_HOST \
  POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  ALLOWED_ORIGINS=$ALLOWED_ORIGINS \
  FORCE_DB_RESET=$FORCE_DB_RESET \
  INITIAL_CRON_WAIT=$INITIAL_CRON_WAIT \
  ICOS_INTEGRATION_SCHEDULE=$ICOS_INTEGRATION_SCHEDULE \
  npm run start:prod
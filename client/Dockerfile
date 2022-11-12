# Build environment
FROM node:14.21.1 as build

ARG GQL_ENDPOINT
ARG DOWNLOADS_ENDPOINT

WORKDIR /app
COPY . .

RUN echo "GQL_ENDPOINT=$GQL_ENDPOINT" > .env
RUN echo "DOWNLOADS_ENDPOINT=$DOWNLOADS_ENDPOINT" >> .env

RUN npm ci --only=production
RUN npm run dist

# Production environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/localhost.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
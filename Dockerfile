FROM node:alpine AS builder
COPY D0020E_App/package.json /app/package.json
WORKDIR /app
RUN yarn install

COPY D0020E_App/ /app

RUN npx expo export --platform web

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /app/dist /usr/share/nginx/html
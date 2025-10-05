FROM node:16-alpine as alpine
RUN mkdir -p /app
WORKDIR /app
COPY ./cats-warehouse/package.json /app
RUN yarn install
COPY ./cats-warehouse /app
RUN yarn run build --configuration=production

FROM nginx:latest
EXPOSE 80
COPY ./cats-warehouse/docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=alpine /app/dist /usr/share/nginx/html

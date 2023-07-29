FROM node:14-alpine as build

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/app /usr/share/nginx/html

EXPOSE 80

FROM node:16

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]

# FROM nginx:lastest

# COPY --from=build /usr/local/app/dist/sample-angular-app /usr/share/nginx/html

# EXPOSE 80

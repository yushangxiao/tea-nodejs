FROM node:20-alpine

COPY . /app
WORKDIR /app
RUN npm install
VOLUME /app/web/images/product
CMD [ "node", "app.js" ]
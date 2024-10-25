FROM node:18

WORKDIR /app

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
RUN npm install -g ts-node nodemon
COPY . .

EXPOSE 8080

# CMD npm start
CMD [ "nodemon", "server.js", "--ext \"ts,json\"" ]
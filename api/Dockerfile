FROM node:14

WORKDIR /user/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

COPY ./index.js ./

COPY ./src/ ./src

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
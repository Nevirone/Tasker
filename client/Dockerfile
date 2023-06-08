FROM node:14

WORKDIR /user/src/app/client

COPY ./package.json ./
COPY ./package-lock.json ./

COPY ./src/ ./src
COPY ./public/ ./public

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
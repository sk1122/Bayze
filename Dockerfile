FROM node:lts-slim

WORKDIR /home/app/backend

COPY ./package.json .

RUN ["yarn"]

COPY . .

CMD ["yarn", "dev"]
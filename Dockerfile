FROM node:latest

WORKDIR /home/node/app

COPY package.json .
COPY pnpm-lock.yaml .

RUN corepack enable && pnpm install

COPY . .

EXPOSE $PORT

# to run additinal scripts and commands
# RUN apt-get update && \ 
#   apt-get -y dist-upgrade

VOLUME [ "/home/node/app" ]

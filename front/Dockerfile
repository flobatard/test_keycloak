FROM node:24-alpine

ENV NODE_ENV=production

RUN mkdir /project
WORKDIR /project
RUN npm i npm@latest -g
RUN npm install -g @angular/cli@20

COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm ci

ARG env=production
RUN echo $env

COPY . .
#USER node
RUN ng build --configuration=$env
RUN ng version

CMD ["node", "./dist/front/server/server.mjs"]
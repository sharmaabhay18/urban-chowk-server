FROM node as prod

WORKDIR /var/www/app

COPY package*.json ./

RUN npm install

WORKDIR /var/www/app

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start" ]

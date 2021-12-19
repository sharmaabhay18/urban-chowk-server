FROM node as prod

WORKDIR /var/www/app

COPY package*.json ./

RUN npm install

WORKDIR /var/www/app

COPY . .

CMD [ "npm", "start" ]

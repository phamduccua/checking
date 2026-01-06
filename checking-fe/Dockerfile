FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5001

CMD ["serve", "-s", "dist", "-l", "5001"]
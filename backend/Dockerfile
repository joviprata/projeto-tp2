FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force 

COPY . .

EXPOSE 5555
CMD ["npm", "run", "start"]
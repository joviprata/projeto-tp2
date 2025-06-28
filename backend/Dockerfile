FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force 

COPY . .

RUN npx prisma generate
EXPOSE 5555
CMD ["npm", "run", "dev"]
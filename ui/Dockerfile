FROM node:10

WORKDIR /usr/src/app/ui
COPY package*.json ./

RUN npm install
EXPOSE 8080
CMD ["npm", "run", "dev"]

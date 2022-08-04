FROM node:16.16

WORKDIR /usr/yawod/
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5555

CMD [ "npm", "start" ]

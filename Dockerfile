FROM node:14.19.3

WORKDIR /LMS_app

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 8753

CMD ["npm","run","start"]
FROM node:20-alpine

WORKDIR /lms_app

COPY package.json .

RUN npm install --only=production
RUN npm cache clean --force


COPY . .

EXPOSE 8753

CMD ["npm","run","start"]

FROM node:23-alpine3.20

WORKDIR /app

COPY yarn.lock  package.json ./

RUN corepack enable 

RUN yarn install

COPY . .

EXPOSE 3000

#CMD ["yarn", "install"]

CMD ["yarn", "start", "--host","0.0.0.0"]

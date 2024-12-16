FROM node:18-alpine
WORKDIR /api

ARG URL
ENV URL ${URL}

#RUN rm -rf node_modules/
COPY ./package*.json .
RUN npm install -g npm@9.8.1
COPY . .
#RUN npm install
RUN npm ci
RUN npm run build
EXPOSE 1337
CMD ["npm","run","develop"]

FROM node:20.5.1-alpine3.18

ARG API_URL
ARG TOKEN_API

# receive api tokens from docker compose
ENV API_URL ${API_URL}
ENV TOKEN_API ${TOKEN_API}

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "preview"]
FROM node:19.5.0-alpine3.17 AS builder
COPY package.json .
RUN npm install

FROM node:19.5.0-alpine3.17 AS runner 
WORKDIR /app
COPY --from=builder node_modules ./node_modules
COPY models ./models
COPY index.js .
ENTRYPOINT [ "node", "index.js" ]
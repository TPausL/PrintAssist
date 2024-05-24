FROM node:18 as build

WORKDIR /usr/src/print-assist


## installing project
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run gen-times
RUN npm run build:frontend
RUN npm run build:backend

FROM node:18 as production

WORKDIR /usr/src/print-assist
COPY --from=build /usr/src/print-assist/dist ./dist

ENTRYPOINT node dist-backend/backend/index.js
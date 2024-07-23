FROM node:18-slim

WORKDIR /usr/src/print-assist

## installing global dependencies
# installing prusa slicer
RUN apt update
RUN apt install prusa-slicer -y

## installing project
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run gen-times
RUN npm run build:frontend
RUN npm run build:backend

ENTRYPOINT node dist-backend/backend/index.js
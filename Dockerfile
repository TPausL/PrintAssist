FROM node:18

ENV PROJECT_URL, ORY_SLUG
WORKDIR /usr/src/print-assist

## installing global dependencies
# installing prusa slicer
RUN apt update
RUN apt install prusa-slicer -y

# installing ory    
RUN curl -o install.sh https://raw.githubusercontent.com/ory/meta/master/install.sh
RUN chmod +x install.sh
RUN ./install.sh -b . ory
RUN cp ./ory /usr/local/bin/

## installing project
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run gen-times
RUN npm run build:frontend
RUN npm run build:backend

ENTRYPOINT sh ./docker-entry.sh ${PROJECT_URL} ${ORY_SLUG}
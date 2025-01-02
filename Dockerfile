FROM openscad/openscad:dev AS openscad-builder
FROM node:18-slim AS runner

COPY --from=openscad-builder /usr/local/bin/openscad /usr/local/bin/openscad

WORKDIR /usr/src/print-assist

## installing global dependencies
# installing prusa slicer
RUN apt update
RUN apt install prusa-slicer wget fontconfig -y --no-install-recommends

RUN mkdir -p /usr/share/fonts/truetype/poppins && \
    wget --no-check-certificate -q https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-ExtraBold.ttf -O /usr/share/fonts/truetype/poppins/Poppins-ExtraBold.ttf && \
    fc-cache -f -v


## installing project
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run gen-times
RUN npm run build:frontend
RUN npm run build:backend

ENTRYPOINT node dist-backend/backend/index.js
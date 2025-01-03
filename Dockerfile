FROM openscad/openscad:dev AS openscad-builder
FROM node:18-slim AS runner

COPY --from=openscad-builder /usr/local/bin/openscad /usr/local/bin/openscad

WORKDIR /usr/src/print-assist

## installing global dependencies
# installing prusa slicer
RUN apt update
RUN apt-get install -y --no-install-recommends \
    libcairo2 libdouble-conversion3 libxml2 lib3mf1 libzip4 libharfbuzz0b \
    libboost-thread1.74.0 libboost-program-options1.74.0 libboost-filesystem1.74.0 \
    libboost-regex1.74.0 libmpfr6 libqscintilla2-qt5-15 \
    libqt5multimedia5 libqt5concurrent5 libtbb12 libglu1-mesa \
    libglew2.2 xvfb xauth wget fontconfig prusa-slicer

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
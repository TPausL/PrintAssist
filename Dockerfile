# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/print-assist

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g yarpm
# RUN npm run gen-times

# Copy the rest of the application code
COPY . .

# Download the script locally
RUN curl -o install.sh https://raw.githubusercontent.com/ory/meta/master/install.sh

# Make the script executable
RUN chmod +x install.sh

# Execute the script
RUN ./install.sh -b . ory
RUN cp ./ory /usr/local/bin/
RUN npm run build-frontend
# Expose the port your app is listening on
EXPOSE 8080
ENV VITE_PROJECT_URL, ORY_SLUG, PORT = 8080
# Specify the command to run your app
ENTRYPOINT sh ./docker-entry.sh ${VITE_PROJECT_URL} ${ORY_SLUG} ${PORT}
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
RUN npm run build-frontend

# Copy the rest of the application code
COPY . .

# Expose the port your app is listening on
EXPOSE 3000
# Specify the command to run your app
CMD ["npm", "run-backend"]
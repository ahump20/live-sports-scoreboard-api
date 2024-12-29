# Base image
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install necessary dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the port where the app server runs
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
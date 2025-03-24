# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Use an official Nginx image as the second stage
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the previous stage to Nginx's html directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]

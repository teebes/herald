# Use Node.js version 14 as the base image
FROM node:14 as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the project files into the working directory
COPY . .

# Build the app
RUN npm run build

# Use nginx to serve the app
FROM nginx:stable-alpine as production-stage

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app from the build-stage to the nginx server
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the outside
EXPOSE 80

# Start nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]

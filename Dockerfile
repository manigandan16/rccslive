# Stage 1: Build React app
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files & build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
